import type { NextFunction, Request, Response } from 'express';

export type Hotel = {
  id?: string;
  name: string;
  location: string;
  city: string;
  supplier: string;
  price: number;
  commissionPct: number;
};

export type HotelComparisonResult = {
  hotels: Hotel[];
  hotelCount: number;
};

export type HotelComparisonOptions = {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
};

export type HotelComparisonInput = {
  city?: string | undefined;
  minPrice?: number | string | undefined;
  maxPrice?: number | string | undefined;
};

export type HotelSupplierListing = {
  hotelId?: string;
  name: string;
  city: string;
  supplier: string;
  price: number;
  commissionPct?: number;
};

export type HotelSupplierListings = HotelSupplierListing[];

export interface HotelQuery {
  hotelId?: string;
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  [key: string]: string | string[] | undefined;
}

export interface HotelRequest extends Request {
  query: HotelQuery;
}

export interface HotelResponse extends Response {}

export type HotelNext = NextFunction;

export interface HealthRequest extends Request {}
export interface HealthResponse extends Response {}

export interface CorsOptions {
  origin: string[];
  methods: Array<'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS'>;
  allowedHeaders: string[];
  credentials: boolean;
}
