<script setup lang="ts">
import type { Station, StationFilters } from '@/types/station.types';

definePageMeta({
  layout: 'default'
});

const { getAllStations, getNearbyStations } = useStations();

// États
const stations = ref<Station[]>([]);
const filteredStations = ref<Station[]>([]);
const selectedStation = ref<Station | null>(null);
const compareStations = ref<Station[]>([]);
const loading = ref(true);
const error = ref('');

// Localisation user (à implémenter plus tard)
const userLocation = ref<{ latitude: number; longitude: number } | null>(null);

// Fonction utilitaire pour extraire le prix adulte du forfait journée
const getDailyPassPrice = (passes: Record<string, unknown>) => {
  const fullDay = passes?.full_day as { adult?: number } | undefined;
  return fullDay?.adult ?? null;
};

// Charger les stations au montage
onMounted(async () => {
  await loadStations();
});

// Charger toutes les stations depuis l'API
const loadStations = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    // Si on a la localisation user, utiliser getNearbyStations
    if (userLocation.value) {
      const stationsWithDistance = await getNearbyStations(
        userLocation.value.latitude,
        userLocation.value.longitude,
        500 // Distance max 500km
      );
      stations.value = stationsWithDistance;
      filteredStations.value = stationsWithDistance;
    } else {
      // Sinon, récupérer toutes les stations
      const allStations = await getAllStations();
      stations.value = allStations;
      filteredStations.value = allStations;
    }
  } catch (e: any) {
    error.value = e.message || 'Erreur lors du chargement des stations';
    console.error('Error loading stations:', e);
  } finally {
    loading.value = false;
  }
};

// Recherche et filtrage
const handleSearch = async (query: string, filters: StationFilters) => {
  try {
    loading.value = true;
    error.value = '';

    // Construire les filtres pour l'API
    const apiFilters: any = {};

    if (query) {
      apiFilters.search = query;
    }

    if (filters.maxLodgingPrice) {
      apiFilters.maxPrice = filters.maxLodgingPrice;
    }

    // Récupérer les stations filtrées depuis l'API
    let results = await getAllStations(apiFilters);

    // Filtres côté client (pour ceux non gérés par l'API)
    
    // Filtre par prix forfait
    if (filters.maxLiftPassPrice) {
      results = results.filter(s => {
        const passPrice = getDailyPassPrice(s.passes);
        return typeof passPrice === 'number' && passPrice <= filters.maxLiftPassPrice;
      });
    }

    // Filtre par niveau
    if (filters.levels.length > 0) {
      results = results.filter(s => 
        filters.levels.some((level: string) => s.level.includes(level))
      );
    }

    // Filtre par distance (si localisation dispo)
    if (userLocation.value && filters.maxDistance) {
      results = results.filter((s: any) => {
        return !s.distance || s.distance <= filters.maxDistance;
      });
    }

    filteredStations.value = results;
  } catch (e: any) {
    error.value = e.message || 'Erreur lors de la recherche';
    console.error('Error searching stations:', e);
  } finally {
    loading.value = false;
  }
};

const handleSelectStation = (station: Station) => {
  selectedStation.value = station;
  // TODO: Ouvrir une modal avec plus de détails
  console.log('Selected station:', station);
};

const handleCompareStation = (station: Station) => {
  const index = compareStations.value.findIndex((s) => s.id === station.id);
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
  <div class="trips-page">
    <div class="page-header">
      <h2>🗺️ Planning Trips</h2>
      <p class="page-subtitle">Trouve ta prochaine destination !</p>
    </div>

    <!-- Message d'erreur -->
    <div v-if="error" class="error-banner">
      <span>❌</span>
      <p>{{ error }}</p>
      <button @click="loadStations" class="retry-btn">Réessayer</button>
    </div>
    
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Sidebar : Recherche & Filtres -->
      <div class="lg:col-span-1">
        <div class="lg:sticky lg:top-24">
          <TripsStationSearch @search="handleSearch" />
          
          <!-- Stations en comparaison -->
          <div v-if="compareStations.length > 0" class="mt-6 bg-ice-100 rounded-xl p-4">
            <h4 class="font-semibold text-mountain-900 mb-3">
              🔀 Comparaison ({{ compareStations.length }}/3)
            </h4>
            <div class="space-y-2">
              <div
                v-for="station in compareStations"
                :key="station.id"
                class="flex justify-between items-center bg-snow-50 rounded-lg p-2"
              >
                <span class="text-sm font-medium text-mountain-800">{{ station.name }}</span>
                <button
                  @click="handleCompareStation(station)"
                  class="text-powder-500 hover:text-powder-700 text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
            <button
              v-if="compareStations.length >= 2"
              class="w-full mt-3 px-4 py-2 bg-ice-500 text-snow-50 rounded-lg font-medium hover:bg-ice-600 transition-colors"
            >
              Comparer →
            </button>
          </div>
        </div>
      </div>

      <!-- Résultats -->
      <div class="lg:col-span-2">
        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <div class="spinner mx-auto mb-4"></div>
          <p class="text-snow-100 text-lg">Chargement des stations...</p>
        </div>

        <!-- Résultats -->
        <template v-else>
          <div class="mb-4 flex justify-between items-center">
            <h3 class="text-xl font-bold text-snow-50">
              {{ filteredStations.length }} station{{ filteredStations.length > 1 ? 's' : '' }} trouvée{{ filteredStations.length > 1 ? 's' : '' }}
            </h3>
          </div>

          <div v-if="filteredStations.length === 0" class="text-center py-12">
            <div class="text-6xl mb-4">🤷</div>
            <p class="text-snow-100 text-lg">Aucune station ne correspond à tes critères</p>
            <p class="text-snow-200 text-sm mt-2">Essaie d'ajuster les filtres !</p>
          </div>

          <div v-else class="grid grid-cols-1 gap-4">
            <TripsStationCard
              v-for="station in filteredStations"
              :key="station.id"
              :station="station"
              @select="handleSelectStation"
              @compare="handleCompareStation"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trips-page {
  @apply p-4 md:p-8;
}

.page-header {
  @apply mb-8 text-center;
}

.page-header h2 {
  @apply text-snow-50 text-3xl md:text-4xl font-bold m-0 mb-2 drop-shadow-lg;
}

.page-subtitle {
  @apply text-snow-100 text-base m-0;
}

.error-banner {
  @apply flex items-center justify-between gap-4 bg-powder-100 border border-powder-300 text-powder-700 px-6 py-4 rounded-xl mb-6 max-w-7xl mx-auto;
}

.error-banner span {
  @apply text-2xl;
}

.error-banner p {
  @apply flex-1 m-0 font-medium;
}

.retry-btn {
  @apply px-4 py-2 bg-powder-500 text-snow-50 rounded-lg font-medium hover:bg-powder-600 transition-colors;
}

.spinner {
  @apply w-12 h-12 border-4 border-snow-100/30 border-t-snow-50 rounded-full animate-spin;
}
</style>