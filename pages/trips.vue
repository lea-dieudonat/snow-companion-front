<script setup lang="ts">
import stationsData from '@/data/stations.json';
import type { Station, StationFilters } from '@/types/station.types';

definePageMeta({
  layout: 'default'
});

const mapStation = (station: any): Station => ({
  id: station.id,
  name: station.name,
  region: station.region,
  altitudeMin: station.altitude_min,
  altitudeMax: station.altitude_max,
  latitude: station.latitude,
  longitude: station.longitude,
  numSlopes: station.num_slopes,
  numLifts: station.num_lifts,
  kmSlopes: station.km_slopes,
  slopesDetail: station.slopes_detail,
  snowCannons: station.snow_cannons,
  skiArea: station.ski_area,
  level: station.level,
  passes: station.passes,
  avgAccommodationPrice: station.avg_accommodation_price,
  website: station.website,
  description: station.description,
  access: station.access,
  season: station.season,
  services: station.services,
  activities: station.activities,
  createdAt: station.createdAt ?? '',
  updatedAt: station.updatedAt ?? '',
  trips: station.trips ?? [],
});

const getDailyPassPrice = (passes: Record<string, unknown>) => {
  const fullDay = passes?.full_day as { adult?: number } | undefined;
  return fullDay?.adult ?? null;
};

// Données mockées pour l'instant
const stations = ref<Station[]>(stationsData.map(mapStation));
const filteredStations = ref<Station[]>(stationsData.map(mapStation));
const selectedStation = ref<Station | null>(null);
const compareStations = ref<Station[]>([]);

const handleSearch = (query: string, filters: StationFilters) => {
  let results = [...stations.value];

  // Filtre par nom/région
  if (query) {
    const searchLower = query.toLowerCase();
    results = results.filter(s => 
      s.name.toLowerCase().includes(searchLower) ||
      s.region.toLowerCase().includes(searchLower) ||
      s.skiArea.toLowerCase().includes(searchLower)
    );
  }

  // Filtre par prix forfait
  results = results.filter(s => {
    const passPrice = getDailyPassPrice(s.passes);
    return typeof passPrice === 'number' && passPrice <= filters.maxLiftPassPrice;
  });

  // Filtre par prix hébergement
  results = results.filter(s => s.avgAccommodationPrice <= filters.maxLodgingPrice);

  // Filtre par niveau
  if (filters.levels.length > 0) {
    results = results.filter(s => 
      filters.levels.some((level: string) => s.level.includes(level))
    );
  }

  // TODO: Filtrer par distance (besoin de la géolocalisation)

  filteredStations.value = results;
};

const handleSelectStation = (station: Station) => {
  selectedStation.value = station;
  // TODO: Ouvrir une modal avec plus de détails
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
</style>