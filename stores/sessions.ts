import type { Session, CreateSessionInput } from '@/types/session.types';

export const useSessionsStore = defineStore('sessions', () => {
  const api = useApi();
  const userStore = useUserStore();

  const sessions = ref<Session[]>([]);
  const loading = ref(false);

  async function load() {
    loading.value = true;
    try {
      sessions.value = await api<Session[]>('/sessions') ?? [];
    } finally {
      loading.value = false;
    }
  }

  async function create(input: Omit<CreateSessionInput, 'userId'>) {
    const { userId } = userStore;
    if (!userId) throw new Error('Utilisateur non authentifié');
    const { session } = await api<{ session: Session }>('/sessions', {
      method: 'POST',
      body: { ...input, userId },
    });
    sessions.value.push(session);
    return session;
  }

  async function update(id: string, input: Partial<CreateSessionInput>) {
    const { session } = await api<{ session: Session }>(`/sessions/${id}`, {
      method: 'PUT',
      body: input,
    });
    const idx = sessions.value.findIndex(s => s.id === id);
    if (idx !== -1) sessions.value[idx] = session;
    return session;
  }

  async function remove(id: string) {
    await api(`/sessions/${id}`, { method: 'DELETE' });
    sessions.value = sessions.value.filter(s => s.id !== id);
  }

  return { sessions, loading, load, create, update, remove };
});
