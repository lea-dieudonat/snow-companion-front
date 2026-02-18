<script setup lang="ts">
import type { Station, StationFilters } from '@/types/station.types';
import { CURRENT_USER_ID } from '@/composables/useUser';

definePageMeta({ layout: 'default' });

const router = useRouter();
const { getAllStations, getNearbyStations } = useStations();
const { getFavorites, addFavorite, removeFavorite } = useUser();

// --- Favoris ---
const favoriteStations = ref<Station[]>([]);
const favoriteIds = computed(() => favoriteStations.value.map(s => s.id));
const loadingFavorites = ref(true);

// --- Recherche ---
const searchQuery = ref('');
const hasSearched = ref(false);
const searchResults = ref<Station[]>([]);
const loadingSearch = ref(false);
const searchError = ref('');

// --- Comparaison ---
const compareStations = ref<Station[]>([]);

const stations = ref<Station[]>([]);
const filteredStations = ref<Station[]>([]);
const selectedStation = ref<Station | null>(null);
const loading = ref(true);
const error = ref('');
const userLocation = ref<{ latitude: number; longitude: number } | null>(null);

const getDailyPassPrice = (passes: Record<string, unknown>) => {
  const fullDay = passes?.full_day as { adult?: number } | undefined;
  return fullDay?.adult ?? null;
};

onMounted(async () => {
  try {
    favoriteStations.value = await getFavorites();
  } catch (e) {
    console.error(e)
  } finally {
    loadingFavorites.value = false;
  }
});

// --- Handlers favoris ---
const handleToggleFavorite = async (stationId: string) => {
  const isFav = favoriteIds.value.includes(stationId);
  try {
    if (isFav) {
      await removeFavorite(stationId);
      favoriteStations.value = favoriteStations.value.filter(s => s.id !== stationId);
    } else {
      await addFavorite(stationId);
      favoriteStations.value = await getFavorites();
    }
  } catch (e) {
    console.error(e);
  }
}

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

// --- Handlers recherche ---
const handleSearch = async (query: string, filters: StationFilters) => {
  searchQuery.value = query;
  if (!query && !Object.values(filters).some(v => v && (Array.isArray(v) ? v.length : true))) {
    hasSearched.value = false;
    searchResults.value = [];
    return;
  }

  try {
    loadingSearch.value = true;
    searchError.value = '';
    hasSearched.value = true;

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

    searchResults.value = results;
  } catch (e: any) {
    searchError.value = e.message || 'Erreur lors de la recherche';
  } finally {
    loadingSearch.value = false;
  }
};

const handleSelectStation = (station: Station) => {
  router.push(`/stations/${station.id}`);
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
      <h2 class="text-mountain-900 dark:text-snow-50 text-3xl md:text-4xl font-bold m-0 mb-2">Mes Trips</h2>
      <p class="text-mountain-500 dark:text-mountain-300 text-base m-0">Planifie et suis tes aventures en montagne</p>
    </div>

    <div class="max-w-7xl mx-auto space-y-10">

      <!-- ================================================================ -->
      <!-- SECTION 1 : Stations favorites + météo                           -->
      <!-- ================================================================ -->
      <section>
        <h3 class="text-xl font-bold text-mountain-900 dark:text-snow-50 flex items-center gap-2 mb-4">
          <UIcon name="i-lucide-heart" class="text-red-400" />
          Mes stations favorites
        </h3>

        <div v-if="loadingFavorites" class="flex items-center justify-center py-10">
          <UIcon name="i-lucide-loader-2" class="animate-spin text-ice-400 text-4xl" />
        </div>

        <div v-else-if="favoriteStations.length === 0"
          class="border-2 border-dashed border-mountain-200 dark:border-mountain-700 rounded-2xl p-10 text-center">
          <UIcon name="i-lucide-heart" class="text-4xl text-mountain-300 mx-auto mb-3" />
          <p class="text-mountain-500 dark:text-mountain-400 font-medium">Aucune station favorite pour l'instant</p>
          <p class="text-mountain-400 dark:text-mountain-500 text-sm mt-1">
            Recherche une station ci-dessous et ajoute-la à tes favoris ❤️
          </p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <TripsWeatherStationCard v-for="station in favoriteStations" :key="station.id" :station="station"
            :is-favorite="true" @toggle-favorite="handleToggleFavorite" />
        </div>
      </section>

      <!-- ================================================================ -->
      <!-- SECTION 2 : Recherche de stations                                -->
      <!-- ================================================================ -->
      <section>
        <h3 class="text-xl font-bold text-mountain-900 dark:text-snow-50 flex items-center gap-2 mb-4">
          <UIcon name="i-lucide-search" class="text-ice-500" />
          Rechercher une station
        </h3>

        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="lg:sticky lg:top-24 space-y-4">
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
                  <UButton v-if="compareStations.length >= 2" color="primary" block trailing-icon="i-lucide-arrow-right"
                    @click="router.push(`/stations/compare?ids=${compareStations.map(s => s.id).join(',')}`)">
                    Comparer {{ compareStations.length }} stations
                  </UButton>
                </template>
              </UCard>
            </div>
          </div>

          <!-- Résultats -->
          <div class="lg:col-span-2">
            <!-- État par défaut : invite à chercher -->
            <div v-if="!hasSearched"
              class="border-2 border-dashed border-mountain-200 dark:border-mountain-700 rounded-2xl p-12 text-center">
              <UIcon name="i-lucide-mountain-snow"
                class="text-5xl text-mountain-300 dark:text-mountain-600 mx-auto mb-3" />
              <p class="text-mountain-500 dark:text-mountain-400 font-medium">Lance une recherche pour explorer les
                stations</p>
              <p class="text-mountain-400 dark:text-mountain-500 text-sm mt-1">Nom, région, niveau, budget...</p>
            </div>

            <!-- Loading -->
            <div v-else-if="loadingSearch" class="text-center py-12">
              <UIcon name="i-lucide-loader-2" class="text-6xl text-ice-400 animate-spin mx-auto mb-4" />
              <p class="text-mountain-500 text-lg">Recherche en cours...</p>
            </div>

            <!-- Erreur -->
            <UAlert v-else-if="searchError" color="error" variant="soft" icon="i-lucide-alert-circle"
              :title="searchError" class="mb-4" />

            <!-- Résultats -->
            <template v-else>
              <p class="text-base font-semibold text-mountain-700 dark:text-mountain-300 mb-4">
                {{ searchResults.length }} station{{ searchResults.length > 1 ? 's' : '' }} trouvée{{
                  searchResults.length > 1 ? 's' : '' }}
              </p>
              <div v-if="searchResults.length === 0" class="text-center py-12">
                <UIcon name="i-lucide-search-x" class="text-6xl text-mountain-300 mx-auto mb-4" />
                <p class="text-mountain-500 text-lg">Aucune station ne correspond à tes critères</p>
              </div>
              <div v-else class="grid grid-cols-1 gap-4">
                <TripsStationCard v-for="station in searchResults" :key="station.id" :station="station"
                  :is-favorite="favoriteIds.includes(station.id)" @select="handleSelectStation"
                  @compare="handleCompareStation" @favorite="s => handleToggleFavorite(s.id)" />
              </div>
            </template>
          </div>
        </div>
      </section>

      <!-- ================================================================ -->
      <!-- SECTION 3 : Prochain voyage (placeholder Phase 2)                -->
      <!-- ================================================================ -->
      <section>
        <h3 class="text-xl font-bold text-mountain-900 dark:text-snow-50 flex items-center gap-2 mb-4">
          <UIcon name="i-lucide-calendar-check" class="text-ice-500" />
          Mon prochain voyage
        </h3>
        <div class="border-2 border-dashed border-mountain-200 dark:border-mountain-700 rounded-2xl p-12 text-center">
          <UIcon name="i-lucide-map-pinned" class="text-5xl text-mountain-300 dark:text-mountain-600 mx-auto mb-3" />
          <p class="text-mountain-500 dark:text-mountain-400 font-medium">Aucun voyage planifié</p>
          <p class="text-mountain-400 dark:text-mountain-500 text-sm mt-1 mb-4">Crée ton premier trip et visualise-le
            ici</p>
          <UButton icon="i-lucide-plus" color="primary" variant="soft" disabled>
            Créer un voyage (bientôt)
          </UButton>
        </div>
      </section>

    </div>
  </div>
</template>