<script setup lang="ts">
import type { Station, StationFilters } from '@/types/station.types';

definePageMeta({ layout: 'default' });

const { getAllStations, getNearbyStations } = useStations();

const stations = ref<Station[]>([]);
const filteredStations = ref<Station[]>([]);
const selectedStation = ref<Station | null>(null);
const compareStations = ref<Station[]>([]);
const loading = ref(true);
const error = ref('');
const userLocation = ref<{ latitude: number; longitude: number } | null>(null);

const getDailyPassPrice = (passes: Record<string, unknown>) => {
  const fullDay = passes?.full_day as { adult?: number } | undefined;
  return fullDay?.adult ?? null;
};

onMounted(async () => await loadStations());

const loadStations = async () => {
  try {
    loading.value = true;
    error.value = '';
    if (userLocation.value) {
      const stationsWithDistance = await getNearbyStations(userLocation.value.latitude, userLocation.value.longitude, 500);
      stations.value = stationsWithDistance;
      filteredStations.value = stationsWithDistance;
    } else {
      const allStations = await getAllStations();
      stations.value = allStations;
      filteredStations.value = allStations;
    }
  } catch (e: any) {
    error.value = e.message || 'Erreur lors du chargement des stations';
  } finally {
    loading.value = false;
  }
};

const handleSearch = async (query: string, filters: StationFilters) => {
  try {
    loading.value = true;
    error.value = '';
    const apiFilters: any = {};
    if (query) apiFilters.search = query;
    if (filters.maxLodgingPrice) apiFilters.maxPrice = filters.maxLodgingPrice;

    let results = await getAllStations(apiFilters);

    if (filters.maxLiftPassPrice) {
      results = results.filter(s => {
        const passPrice = getDailyPassPrice(s.passes);
        return typeof passPrice === 'number' && passPrice <= filters.maxLiftPassPrice;
      });
    }
    if (filters.levels.length > 0) {
      results = results.filter(s => filters.levels.some((level: string) => s.level.includes(level)));
    }
    if (userLocation.value && filters.maxDistance) {
      results = results.filter((s: any) => !s.distance || s.distance <= filters.maxDistance);
    }

    filteredStations.value = results;
  } catch (e: any) {
    error.value = e.message || 'Erreur lors de la recherche';
  } finally {
    loading.value = false;
  }
};

const handleSelectStation = (station: Station) => {
  selectedStation.value = station;
  console.log('Selected station:', station);
};

const handleCompareStation = (station: Station) => {
  const index = compareStations.value.findIndex(s => s.id === station.id);
  if (index > -1) {
    compareStations.value.splice(index, 1);
  } else if (compareStations.value.length < 3) {
    compareStations.value.push(station);
  } else {
    alert('Tu peux comparer maximum 3 stations à la fois !');
  }
};
</script>

<template>
  <div class="p-4 md:p-8">
    <!-- Header -->
    <div class="mb-8 text-center">
      <UIcon name="i-lucide-map" class="text-5xl text-ice-500 mx-auto mb-4" />
      <h2 class="text-mountain-900 dark:text-snow-50 text-3xl md:text-4xl font-bold m-0 mb-2">Planning Trips</h2>
      <p class="text-mountain-500 dark:text-mountain-300 text-base m-0">Trouve ta prochaine destination !</p>
    </div>

    <!-- Erreur -->
    <UAlert v-if="error" color="error" variant="soft" icon="i-lucide-alert-circle" :title="error"
      class="mb-6 max-w-7xl mx-auto">
      <template #actions>
        <UButton color="error" variant="outline" size="xs" @click="loadStations">
          Réessayer
        </UButton>
      </template>
    </UAlert>

    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <div class="lg:sticky lg:top-24 space-y-6">
          <TripsStationSearch @search="handleSearch" />

          <!-- Comparaison -->
          <UCard v-if="compareStations.length > 0">
            <template #header>
              <h4 class="font-semibold text-mountain-900 dark:text-snow-50 flex items-center gap-2">
                <UIcon name="i-lucide-git-compare" />
                Comparaison ({{ compareStations.length }}/3)
              </h4>
            </template>

            <div class="space-y-2">
              <div v-for="station in compareStations" :key="station.id"
                class="flex justify-between items-center bg-snow-100 dark:bg-mountain-700/50 rounded-lg px-3 py-2">
                <span class="text-sm font-medium text-mountain-800 dark:text-mountain-200">{{ station.name }}</span>
                <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs"
                  @click="handleCompareStation(station)" />
              </div>
            </div>

            <template #footer>
              <UButton v-if="compareStations.length >= 2" color="primary" block trailing-icon="i-lucide-arrow-right">
                Comparer
              </UButton>
            </template>
          </UCard>
        </div>
      </div>

      <!-- Résultats -->
      <div class="lg:col-span-2">
        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <UIcon name="i-lucide-loader-2" class="text-6xl text-ice-400 animate-spin mx-auto mb-4" />
          <p class="text-mountain-500 dark:text-mountain-400 text-lg">Chargement des stations...</p>
        </div>

        <template v-else>
          <p class="text-xl font-bold text-mountain-900 dark:text-snow-50 mb-4 flex items-center gap-2">
            <UIcon name="i-lucide-map-pin" />
            {{ filteredStations.length }} station{{ filteredStations.length > 1 ? 's' : '' }} trouvée{{
              filteredStations.length > 1 ? 's' : '' }}
          </p>

          <div v-if="filteredStations.length === 0" class="text-center py-12">
            <UIcon name="i-lucide-search-x" class="text-6xl text-mountain-300 mx-auto mb-4" />
            <p class="text-mountain-500 text-lg">Aucune station ne correspond à tes critères</p>
            <p class="text-mountain-400 text-sm mt-2">Essaie d'ajuster les filtres !</p>
          </div>

          <div v-else class="grid grid-cols-1 gap-4">
            <TripsStationCard v-for="station in filteredStations" :key="station.id" :station="station"
              @select="handleSelectStation" @compare="handleCompareStation" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>