export interface SlopesDetail {
  green?: number;
  blue?: number;
  red?: number;
  black?: number;
}

export interface PassPricing {
  adult?: number;
  child?: number;
  teen?: number;
}

export interface StationPasses {
  full_day?: PassPricing;
  half_day?: PassPricing;
  weekly?: PassPricing;
}

export interface StationAccess {
  nearest_airport?: string;
  distance_from_airport_km?: number;
  nearest_train_station?: string;
  distance_from_train?: number;
  parking?: boolean;
}

export interface StationSeason {
  start?: string;
  end?: string;
}

export interface Station {
  id: string;
  name: string;
  region: string;
  altitudeMin: number;
  altitudeMax: number;
  latitude: number;
  longitude: number;
  numSlopes: number;
  numLifts: number;
  kmSlopes: number;
  slopesDetail: SlopesDetail;
  snowCannons: number;
  skiArea: string;
  level: string[];
  passes: StationPasses;
  avgAccommodationPrice: number;
  website: string;
  description: string;
  access: StationAccess;
  season: StationSeason;
  services: string[];
  activities: string[];
  createdAt: string;
  updatedAt: string;
  trips: unknown[];
}

export interface StationFilters {
  maxDistance: number;
  maxLiftPassPrice: number;
  maxLodgingPrice: number;
  levels: string[];
}
