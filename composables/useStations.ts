import type { Station } from '@/types/station.types';

export const useStations = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;

  // GET /api/stations - Récupérer toutes les stations
  const getAllStations = async (filters?: {
    region?: string;
    maxPrice?: number;
    minAltitude?: number;
    level?: string;
    search?: string;
  }): Promise<Station[]> => {
    try {
      const params = new URLSearchParams();
      
      if (filters?.region) params.append('region', filters.region);
      if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters?.minAltitude) params.append('minAltitude', filters.minAltitude.toString());
      if (filters?.level) params.append('level', filters.level);
      if (filters?.search) params.append('search', filters.search);

      const queryString = params.toString();
      const url = `${apiBase}/stations${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stations: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in getAllStations:', error);
      throw error;
    }
  };

  // GET /api/stations/:id - Récupérer une station par ID
  const getStationById = async (id: string): Promise<Station> => {
    try {
      const response = await fetch(`${apiBase}/stations/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch station: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in getStationById:', error);
      throw error;
    }
  };

  // GET /api/stations/nearby - Récupérer les stations proches
  const getNearbyStations = async (
    latitude: number,
    longitude: number,
    maxDistance: number = 300
  ): Promise<(Station & { distance: number })[]> => {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        maxDistance: maxDistance.toString(),
      });

      const response = await fetch(`${apiBase}/stations/nearby?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch nearby stations: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in getNearbyStations:', error);
      throw error;
    }
  };

  return {
    getAllStations,
    getStationById,
    getNearbyStations,
  };
};