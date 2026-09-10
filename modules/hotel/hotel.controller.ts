import type { HotelNext, HotelRequest, HotelResponse } from '../../types';

const hotelComparisonService = require('../../services/hotelComparisonService.ts');

module.exports = {
  listHotels: async (req: HotelRequest, res: HotelResponse, next: HotelNext) => {
    try {
      const city = typeof req.query.city === 'string' ? req.query.city.trim() : '';
      const hasMinPrice = req.query.minPrice !== undefined;
      const hasMaxPrice = req.query.maxPrice !== undefined;
      const minPrice = hasMinPrice ? Number(req.query.minPrice) : undefined;
      const maxPrice = hasMaxPrice ? Number(req.query.maxPrice) : undefined;

      if ((hasMinPrice && Number.isNaN(minPrice)) ||
          (hasMaxPrice && Number.isNaN(maxPrice))) {
        return res.status(400).json({ message: 'minPrice and maxPrice must be valid numbers.' });
      }

      if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
        return res.status(400).json({ message: 'minPrice cannot be greater than maxPrice.' });
      }

      const response = await hotelComparisonService.compareHotels({ city, minPrice, maxPrice });

      if (response.hotelCount === 0) {
        return res.status(404).json({ message: 'No hotels found matching the criteria.' });
      }
      return res.status(200).json(response.hotels);

    } catch (error) {
      console.error(error);
      return next(error);
    }
  },

  compareHotels: async (req: HotelRequest, res: HotelResponse, next: HotelNext) => {
    try {
      const city = typeof req.query.city === 'string' ? req.query.city.trim() : '';
      const hasMinPrice = req.query.minPrice !== undefined;
      const hasMaxPrice = req.query.maxPrice !== undefined;
      const minPrice = hasMinPrice ? Number(req.query.minPrice) : undefined;
      const maxPrice = hasMaxPrice ? Number(req.query.maxPrice) : undefined;

      if ((hasMinPrice && Number.isNaN(minPrice)) ||
          (hasMaxPrice && Number.isNaN(maxPrice))) {
        return res.status(400).json({ message: 'minPrice and maxPrice must be valid numbers.' });
      }

      if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
        return res.status(400).json({ message: 'minPrice cannot be greater than maxPrice.' });
      }

      const response = await hotelComparisonService.compareHotels({ city, minPrice, maxPrice });

      return res.status(200).json(response.hotels);
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
};
