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

export interface StationLiveData {
  liftsOpen: number | null;
  liftsTotal: number | null;
  pistesOpen: number | null;
  pistesTotal: number | null;
  baseSnowDepthCm: number | null;
  summitSnowDepthCm: number | null;
  avalancheRisk: number | null;
  updatedAt: string;
}

export interface Station {
  id: string;
  name: string;
  region: string;
  altitudeMin: number | null;
  altitudeMax: number | null;
  latitude: number;
  longitude: number;
  kmSlopes: number | null;
  slopesDetail: SlopesDetail | null;
  snowCannons: number | null;
  snowPark: unknown | null;
  skiArea: string | null;
  level: string[];
  passes: StationPasses | null;
  avgAccommodationPrice: number | null;
  website: string | null;
  description: string | null;
  access: StationAccess | null;
  season: StationSeason | null;
  services: string[];
  activities: string[];
  openPisteCovered: boolean;
  liveData: StationLiveData | null;
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
