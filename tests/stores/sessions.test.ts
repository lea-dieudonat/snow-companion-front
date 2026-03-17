import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import type { Session } from '@/types/session.types';

const mockApi = vi.fn();

vi.mock('@/composables/useApi', () => ({
  useApi: () => mockApi,
}));

const MOCK_USER_ID = 'test-user-id';

vi.mock('@/stores/user', () => ({
  useUserStore: () => ({ userId: MOCK_USER_ID }),
}));

const makeSession = (overrides: Partial<Session> = {}): Session => ({
  id: 'ses-1',
  date: '2024-01-15',
  station: 'Courchevel',
  conditions: 'powder',
  tricks: ['Ollie', '180'],
  notes: 'Super session',
  photos: [],
  rating: 5,
  runCount: null,
  maxSpeed: null,
  totalDistance: null,
  verticalDrop: null,
  userId: MOCK_USER_ID,
  createdAt: '2024-01-15T00:00:00.000Z',
  updatedAt: '2024-01-15T00:00:00.000Z',
  ...overrides,
});

describe('useSessionsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockApi.mockReset();
  });

  it('initialise avec une liste vide', () => {
    const store = useSessionsStore();
    expect(store.sessions).toEqual([]);
    expect(store.loading).toBe(false);
  });

  it('load() charge les sessions', async () => {
    const sessions = [makeSession(), makeSession({ id: 'ses-2', station: 'Tignes' })];
    mockApi.mockResolvedValueOnce(sessions);

    const store = useSessionsStore();
    await store.load();

    expect(mockApi).toHaveBeenCalledWith('/sessions');
    expect(store.sessions).toEqual(sessions);
  });

  it('load() retourne [] si l\'API retourne null', async () => {
    mockApi.mockResolvedValueOnce(null);

    const store = useSessionsStore();
    await store.load();

    expect(store.sessions).toEqual([]);
  });

  it('load() remet loading à false même en cas d\'erreur', async () => {
    mockApi.mockRejectedValueOnce(new Error('réseau indisponible'));

    const store = useSessionsStore();
    await expect(store.load()).rejects.toThrow();
    expect(store.loading).toBe(false);
  });

  it('create() ajoute la session et injecte userId', async () => {
    const created = makeSession();
    mockApi.mockResolvedValueOnce({ session: created });

    const store = useSessionsStore();
    const result = await store.create({
      date: '2024-01-15',
      station: 'Courchevel',
    });

    expect(mockApi).toHaveBeenCalledWith('/sessions', {
      method: 'POST',
      body: { date: '2024-01-15', station: 'Courchevel', userId: MOCK_USER_ID },
    });
    expect(result).toEqual(created);
    expect(store.sessions).toContainEqual(created);
  });

  it('update() modifie la session dans la liste', async () => {
    const original = makeSession();
    const updated = makeSession({ station: 'Val d\'Isère', rating: 4 });
    mockApi.mockResolvedValueOnce([original]); // load
    mockApi.mockResolvedValueOnce({ session: updated }); // update

    const store = useSessionsStore();
    await store.load();
    await store.update('ses-1', { station: 'Val d\'Isère', rating: 4 });

    expect(store.sessions[0]).toEqual(updated);
  });

  it('update() ne modifie rien si l\'id est introuvable', async () => {
    const original = makeSession();
    const updated = makeSession({ id: 'ses-999', station: 'Inconnu' });
    mockApi.mockResolvedValueOnce([original]); // load
    mockApi.mockResolvedValueOnce({ session: updated }); // update

    const store = useSessionsStore();
    await store.load();
    await store.update('ses-999', { station: 'Inconnu' });

    expect(store.sessions).toEqual([original]);
  });

  it('remove() supprime la session de la liste', async () => {
    const s1 = makeSession({ id: 'ses-1' });
    const s2 = makeSession({ id: 'ses-2', station: 'Tignes' });
    mockApi.mockResolvedValueOnce([s1, s2]); // load
    mockApi.mockResolvedValueOnce(undefined); // delete

    const store = useSessionsStore();
    await store.load();
    await store.remove('ses-1');

    expect(mockApi).toHaveBeenCalledWith('/sessions/ses-1', { method: 'DELETE' });
    expect(store.sessions).toEqual([s2]);
  });
});
