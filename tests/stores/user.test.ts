import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import type { AuthResponse } from '@/types/auth.types';

const mockApi = vi.fn();

vi.mock('@/composables/useApi', () => ({
  useApi: () => mockApi,
}));

const mockAuthResponse: AuthResponse = {
  token: 'fake-jwt-token',
  user: { id: 'user-1', email: 'alex@test.com', name: 'Alex' },
};

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockApi.mockReset();
  });

  it('initialise sans utilisateur authentifié', () => {
    const store = useUserStore();
    expect(store.currentUser).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(store.userId).toBeNull();
  });

  it('login() stocke le token et l\'utilisateur', async () => {
    mockApi.mockResolvedValueOnce(mockAuthResponse);

    const store = useUserStore();
    await store.login({ email: 'alex@test.com', password: 'password' });

    expect(mockApi).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: { email: 'alex@test.com', password: 'password' },
    });
    expect(store.currentUser).toEqual(mockAuthResponse.user);
    expect(store.userId).toBe('user-1');
    expect(store.isAuthenticated).toBe(true);
  });

  it('register() stocke le token et l\'utilisateur', async () => {
    mockApi.mockResolvedValueOnce(mockAuthResponse);

    const store = useUserStore();
    await store.register({ email: 'alex@test.com', password: 'password', name: 'Alex' });

    expect(mockApi).toHaveBeenCalledWith('/auth/register', {
      method: 'POST',
      body: { email: 'alex@test.com', password: 'password', name: 'Alex' },
    });
    expect(store.currentUser).toEqual(mockAuthResponse.user);
    expect(store.isAuthenticated).toBe(true);
  });

  it('logout() efface le token et l\'utilisateur', async () => {
    mockApi.mockResolvedValueOnce(mockAuthResponse);

    const store = useUserStore();
    await store.login({ email: 'alex@test.com', password: 'password' });
    store.logout();

    expect(store.currentUser).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(store.userId).toBeNull();
  });

  it('login() propage l\'erreur en cas d\'échec API', async () => {
    mockApi.mockRejectedValueOnce(new Error('Identifiants invalides'));

    const store = useUserStore();
    await expect(
      store.login({ email: 'bad@test.com', password: 'wrong' }),
    ).rejects.toThrow('Identifiants invalides');
    expect(store.currentUser).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });
});
