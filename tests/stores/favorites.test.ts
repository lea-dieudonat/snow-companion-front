import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import type { Station } from '@/types/station.types';

const mockApi = vi.fn();

vi.mock('@/composables/useApi', () => ({
  useApi: () => mockApi,
}));

const MOCK_USER_ID = 'test-user-id';

vi.mock('@/stores/user', () => ({
  useUserStore: () => ({ userId: MOCK_USER_ID }),
}));

const stationA: Station = {
  id: 'sta-1',
  name: 'Les Arcs',
  region: 'Savoie',
  altitudeMin: 1200,
  altitudeMax: 3226,
  latitude: 45.55,
  longitude: 6.78,
  kmSlopes: 200,
  snowCannons: 10,
  snowPark: null,
  skiArea: 'Paradiski',
  level: ['beginner', 'intermediate', 'advanced'],
  passes: {},
  avgAccommodationPrice: 120,
  website: 'https://lesarcs.com',
  description: '',
  access: {},
  season: {},
  services: [],
  activities: [],
  openPisteCovered: true,
  liveData: {
    liftsOpen: 30,
    liftsTotal: 35,
    pistesOpen: 50,
    pistesTotal: 56,
    slopesDetail: { green: 8, blue: 20, red: 18, black: 10 },
    slopesOpen: { green: 6, blue: 16, red: 12, black: 6 },
    baseSnowDepthCm: 80,
    summitSnowDepthCm: 150,
    avalancheRisk: 2,
    updatedAt: '2024-01-01T12:00:00Z',
  },
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  trips: [],
};

const stationB: Station = { ...stationA, id: 'sta-2', name: 'Tignes' };

describe('useFavoritesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockApi.mockReset();
  });

  it('initialise avec une liste vide', () => {
    const store = useFavoritesStore();
    expect(store.stations).toEqual([]);
    expect(store.ids).toEqual([]);
    expect(store.loading).toBe(false);
  });

  it('load() charge les favoris et met à jour ids', async () => {
    mockApi.mockResolvedValueOnce([stationA, stationB]);

    const store = useFavoritesStore();
    await store.load();

    expect(mockApi).toHaveBeenCalledWith('/users/favorites');
    expect(store.stations).toEqual([stationA, stationB]);
    expect(store.ids).toEqual(['sta-1', 'sta-2']);
  });

  it('load() remet loading à false même en cas d\'erreur', async () => {
    mockApi.mockRejectedValueOnce(new Error('API error'));

    const store = useFavoritesStore();
    await expect(store.load()).rejects.toThrow('API error');
    expect(store.loading).toBe(false);
  });

  it('remove() supprime la station localement sans rechargement', async () => {
    mockApi.mockResolvedValueOnce([stationA, stationB]); // load
    mockApi.mockResolvedValueOnce(undefined);            // remove

    const store = useFavoritesStore();
    await store.load();
    await store.remove('sta-1');

    expect(mockApi).toHaveBeenCalledWith(
      '/users/favorites/sta-1',
      { method: 'DELETE' },
    );
    expect(store.stations).toEqual([stationB]);
    expect(store.ids).not.toContain('sta-1');
  });

  it('add() appelle l\'API puis recharge les favoris', async () => {
    mockApi.mockResolvedValueOnce(undefined);          // add POST
    mockApi.mockResolvedValueOnce([stationA, stationB]); // load after add

    const store = useFavoritesStore();
    await store.add('sta-1');

    expect(mockApi).toHaveBeenCalledWith(
      '/users/favorites/sta-1',
      { method: 'POST' },
    );
    expect(store.stations).toEqual([stationA, stationB]);
  });

  describe('toggle()', () => {
    it('supprime si déjà favori', async () => {
      mockApi.mockResolvedValueOnce([stationA]);  // load
      mockApi.mockResolvedValueOnce(undefined);   // remove

      const store = useFavoritesStore();
      await store.load();
      await store.toggle('sta-1');

      expect(store.ids).not.toContain('sta-1');
    });

    it('ajoute si pas encore favori', async () => {
      mockApi.mockResolvedValueOnce(undefined);          // add POST
      mockApi.mockResolvedValueOnce([stationA, stationB]); // load after add

      const store = useFavoritesStore();
      await store.toggle('sta-1');

      expect(store.stations).toEqual([stationA, stationB]);
    });
  });
});
