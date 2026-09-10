 

import type {
  Hotel,
  HotelComparisonInput,
  HotelComparisonOptions,
  HotelComparisonResult,
  HotelSupplierListing,
  HotelSupplierListings
} from '../types';
const { supplierAHotels, supplierBHotels } = require('../mock/supplierData.ts');

const { createClient } = require('redis');
const { Connection, Client } = require('@temporalio/client');

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err: Error) => console.error('Redis Client Error', err));

(async () => {
  try {
    await redisClient.connect();
    console.log('Successfully connected to Redis');
  } catch (err: unknown) {
    console.error('Unable to connect to Redis. Start Redis or set REDIS_URL.', err);
  }
})();


class TemporalHotelWorkflow {
  async run({ city = '', minPrice, maxPrice }: HotelComparisonInput = {}) {
    const parsedMin = typeof minPrice === 'string' ? Number(minPrice) : minPrice;
    const parsedMax = typeof maxPrice === 'string' ? Number(maxPrice) : maxPrice;
    const cityKey = typeof city === 'string' ? city.trim().toLowerCase() : '';

    const supplierOneListings = await supplierAHotels();
    const supplierTwoListings = await supplierBHotels();

    const deduped = this.compareHotels(supplierOneListings, supplierTwoListings, { city: cityKey });

    await this.saveDedupedHotelsToRedis(cityKey, deduped.hotels);

    const filteredHotels = await this.filterHotelsInRedis(cityKey, deduped.hotels, parsedMin, parsedMax);

    return {
      hotelCount: filteredHotels.length,
      hotels: filteredHotels
    };
  }

  compareHotels(
    supplierOneListings: HotelSupplierListings,
    supplierTwoListings: HotelSupplierListings,
    { city = '' }: HotelComparisonOptions = {}
  ): HotelComparisonResult {
    const allListings: HotelSupplierListings = [...supplierOneListings, ...supplierTwoListings];
    const bestListings = new Map<string, HotelSupplierListing>();

    for (const listing of allListings) {
      const nameKey = listing.name.trim().toLowerCase();
      const existing = bestListings.get(nameKey);

      console.log(`Comparing listing: ${nameKey}`);
      console.log(`Existing listing price: ${existing?.price}`);
      console.log(`listing price: ${listing?.price}`);

      if (!existing || listing.price < existing.price) {
        bestListings.set(nameKey, listing);
      }
    }

    const hotelList: Hotel[] = [...bestListings.values()]
      .filter((listing) => {
        const isCityMatch = city ? listing.city.toLowerCase() === city : true;
        return isCityMatch;
      })
      .map((listing): Hotel => ({
        id: `${listing.name}-${listing.city}`,
        name: listing.name,
        city: listing.city,
        supplier: listing.supplier,
        price: listing.price,
        commissionPct: listing.commissionPct || 0,
        location: listing.city
      }));

    return {
      hotelCount: hotelList.length,
      hotels: hotelList.sort((a, b) => a.name.localeCompare(b.name))
    };
  }

  async saveDedupedHotelsToRedis(cityKey: string, hotels: Hotel[]) {
    console.log(`Saving deduped hotels to Redis for city: ${cityKey || 'all'} with ${JSON.stringify(hotels)} hotels.`);
    const dedupedKey = `hotels:deduped:${cityKey || 'all'}`;
    await redisClient.set(dedupedKey, JSON.stringify(hotels));

    const priceSetKey = `hotels:price:set:${cityKey || 'all'}`;
    await redisClient.del(priceSetKey);

    for (const hotel of hotels) {
      await redisClient.zAdd(priceSetKey, [{ score: hotel.price, value: JSON.stringify(hotel) }]);
    }
  }

  async filterHotelsInRedis(cityKey: string, hotels: HotelSupplierListings, minPrice?: number | string, maxPrice?: number | string) {
    const priceSetKey = `hotels:price:set:${cityKey || 'all'}`;
    const minScore = Number.isFinite(Number(minPrice)) ? String(minPrice) : '-inf';
    const maxScore = Number.isFinite(Number(maxPrice)) ? String(maxPrice) : '+inf';

    const raw: string[] = await redisClient.sendCommand(['ZRANGEBYSCORE', priceSetKey, minScore, maxScore]);

    const filtered = raw.map((item: string) => {
      try {
        return JSON.parse(item);
      } catch (e) {
        return item;
      }
    });

    return filtered.sort((a: HotelSupplierListing, b: HotelSupplierListing) => a.name.localeCompare(b.name));
  }
}

class HotelComparisonService {
  async compareHotels({ city, minPrice, maxPrice }: HotelComparisonInput = {}) {
    const workflowInput: HotelComparisonInput = { city, minPrice, maxPrice };

    try {
      const temporalAddress = process.env.TEMPORAL_ADDRESS || 'localhost:7233';
      const temporalTaskQueue = process.env.TEMPORAL_TASK_QUEUE || 'hotel-comparison-task-queue';

      if (process.env.TEMPORAL_ENABLED !== 'false') {
        const connection = await Connection.connect({ address: temporalAddress });
        const client = new Client({ connection });

        const handle = await client.workflow.start({
          taskQueue: temporalTaskQueue,
          workflowType: 'TemporalHotelWorkflow',
          args: [workflowInput],
          workflowId: `hotel-comparison-${Date.now()}`
        });

        const response = await handle.result();
        await connection.close();
        return response;
      }
    } catch (error) {
      console.warn('Temporal workflow unavailable, falling back to the in-process workflow.', error);
    }

    const orchestrator = new TemporalHotelWorkflow();
    return orchestrator.run(workflowInput);
  }
}

module.exports = new HotelComparisonService();
