import type { Trip, CreateTripInput } from '@/types/trip.types';

export const useTripsStore = defineStore('trips', () => {
  const api = useApi();

  const trips = ref<Trip[]>([]);
  const loading = ref(false);

  async function load() {
    loading.value = true;
    try {
      trips.value = await api<Trip[]>('/trips') ?? [];
    } finally {
      loading.value = false;
    }
  }

  async function create(input: CreateTripInput) {
    const { trip } = await api<{ trip: Trip }>('/trips', {
      method: 'POST',
      body: input,
    });
    trips.value.push(trip);
    // Trier par date de départ croissante
    trips.value.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    return trip;
  }

  async function remove(id: string) {
    await api(`/trips/${id}`, { method: 'DELETE' });
    trips.value = trips.value.filter(t => t.id !== id);
  }

  // Prochain trip = le plus proche dans le futur (ou en cours)
  const nextTrip = computed((): Trip | null => {
    const now = new Date();
    const upcoming = trips.value.filter(t => new Date(t.startDate) >= now);
    return upcoming[0] ?? null;
  });

  const upcomingTrips = computed(() =>
    trips.value.filter(t => new Date(t.startDate) >= new Date())
  );

  return { trips, loading, load, create, remove, nextTrip, upcomingTrips };
});