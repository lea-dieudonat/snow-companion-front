import type { AuthUser, AuthResponse, LoginInput, RegisterInput } from '~/types/auth.types';

export const useUserStore = defineStore('user', () => {
  const api = useApi();
  const token = useCookie<string | null>('auth_token', { default: () => null });
  const currentUser = ref<AuthUser | null>(null);

  const isAuthenticated = computed(() => !!token.value && !!currentUser.value);
  const userId = computed(() => currentUser.value?.id ?? null);

  async function login(input: LoginInput) {
    const { token: jwt, user } = await api<AuthResponse>('/auth/login', {
      method: 'POST',
      body: input,
    });
    token.value = jwt;
    currentUser.value = user;
  }

  async function register(input: RegisterInput) {
    const { token: jwt, user } = await api<AuthResponse>('/auth/register', {
      method: 'POST',
      body: input,
    });
    token.value = jwt;
    currentUser.value = user;
  }

  async function fetchMe() {
    if (!token.value) return;
    try {
      const { user } = await api<{ user: AuthUser }>('/auth/me');
      currentUser.value = user;
    } catch {
      logout();
    }
  }

  function logout() {
    token.value = null;
    currentUser.value = null;
  }

  return { token, currentUser, isAuthenticated, userId, login, register, logout, fetchMe };
});
