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
    <AppPageHeader title="Mes Trips" description="Planifie et suis tes aventures en montagne" icon="i-lucide-map" />

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