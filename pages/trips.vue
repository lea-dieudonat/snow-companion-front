<script setup lang="ts">
definePageMeta({ layout: 'default' });
import { useTrips } from '@/composables/useTrips';

const {
  favoriteStations,
  favoriteIds,
  loadingFavorites,
  loadFavorites,
  handleToggleFavorite,
  hasSearched,
  searchResults,
  loadingSearch,
  searchError,
  handleSearch,
  compareStations,
  handleCompareStation,
  handleSelectStation
} = useTrips();
onMounted(loadFavorites);
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
      <!-- SECTION 1 : Stations favorites + météo                           -->
      <FavoritesSection :favorite-stations="favoriteStations" :loading-favorites="loadingFavorites"
        @toggleFavorite="handleToggleFavorite" />
      <!-- SECTION 2 : Recherche de stations                                -->
      <SearchSection :has-searched="hasSearched" :search-results="searchResults" :loading-search="loadingSearch"
        :search-error="searchError" @search="handleSearch" @compare-station="handleCompareStation"
        @select-station="handleSelectStation" />
      <!-- TODO: SECTION 3 : Prochain voyage (placeholder Phase 2)                -->
      <NextTripSection />
    </div>
  </div>
</template>