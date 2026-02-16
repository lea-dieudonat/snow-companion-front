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
  slopesDetail: Record<string, unknown>;
  snowCannons: number;
  skiArea: string;
  level: string[];
  passes: Record<string, unknown>;
  avgAccommodationPrice: number;
  website: string;
  description: string;
  access: Record<string, unknown>;
  season: Record<string, unknown>;
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
