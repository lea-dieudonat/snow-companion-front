export interface TripStation {
  id: string;
  name: string;
  region: string;
  altitudeMin: number;
  altitudeMax: number;
}

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string | null;
  stationId: string;
  station: TripStation;
  userId: string;
  notes: string | null;
  status: 'planned' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripInput {
  name: string;
  startDate: string; // ISO 8601
  endDate?: string;  // ISO 8601
  stationId: string;
  notes?: string;
}