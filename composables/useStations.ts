import type { Station } from '@/types/station.types';

export const useStations = () => {
  const api = useApi();

  const getAllStations = async (filters?: {
    region?: string;
    maxPrice?: number;
    minAltitude?: number;
    search?: string;
  }): Promise<Station[]> => {
    const params = new URLSearchParams();
    if (filters?.region) params.append('region', filters.region);
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.minAltitude) params.append('minAltitude', filters.minAltitude.toString());
    if (filters?.search) params.append('search', filters.search);

    const query = params.toString();
    return api<Station[]>(`/stations${query ? `?${query}` : ''}`);
  };

  const getStationById = async (id: string): Promise<Station> => {
    return api<Station>(`/stations/${id}`);
  };

  const getNearbyStations = async (
    latitude: number,
    longitude: number,
    maxDistance: number = 300
  ): Promise<(Station & { distance: number })[]> => {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      maxDistance: maxDistance.toString(),
    });
    return api<(Station & { distance: number })[]>(`/stations/nearby?${params.toString()}`);
  };

  return { getAllStations, getStationById, getNearbyStations };
};
