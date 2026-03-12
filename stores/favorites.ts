import type { Station } from '@/types/station.types';

export const useFavoritesStore = defineStore('favorites', () => {
  const api = useApi();
  const userStore = useUserStore();

  const stations = ref<Station[]>([]);
  const ids = computed(() => stations.value.map(s => s.id));
  const loading = ref(false);

  async function load() {
    loading.value = true;
    try {
      stations.value = await api<Station[]>(`/users/${userStore.userId}/favorites`);
    } finally {
      loading.value = false;
    }
  }

  async function add(stationId: string) {
    await api(`/users/${userStore.userId}/favorites/${stationId}`, { method: 'POST' });
    await load();
  }

  async function remove(stationId: string) {
    await api(`/users/${userStore.userId}/favorites/${stationId}`, { method: 'DELETE' });
    stations.value = stations.value.filter(s => s.id !== stationId);
  }

  async function toggle(stationId: string) {
    if (ids.value.includes(stationId)) {
      await remove(stationId);
    } else {
      await add(stationId);
    }
  }

  return { stations, ids, loading, load, add, remove, toggle };
});
