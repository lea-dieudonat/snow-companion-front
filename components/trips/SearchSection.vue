<script setup lang="ts">
import type { Station, StationFilters } from '@/types/station.types';

const router = useRouter();

defineProps<{
    favoriteIds: string[];
    hasSearched: boolean;
    searchResults: Station[];
    loadingSearch: boolean;
    searchError: string | null;
    compareStations: Station[];
}>();

defineEmits<{
    toggleFavorite: [stationId: string];
    search: [query: string, filters: StationFilters];
    compareStation: [station: Station];
    selectStation: [station: Station];
}>();
</script>

<template>
    <section>
        <h3 class="heading-section mb-4">
            <UIcon name="i-lucide-search" class="text-ice-500" />
            Rechercher une station
        </h3>

        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Sidebar -->
            <div class="lg:col-span-1">
                <div class="lg:sticky lg:top-24 space-y-4">
                    <TripsStationSearch @search="(query, filters) => $emit('search', query, filters)" />

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
                                class="flex justify-between items-center info-box">
                                <span class="text-sm font-medium text-mountain-800 dark:text-mountain-200">{{
                                    station.name }}</span>
                                <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs"
                                    @click="$emit('compareStation', station)" />
                            </div>
                        </div>
                        <template #footer>
                            <UButton v-if="compareStations.length >= 2" color="primary" block
                                trailing-icon="i-lucide-arrow-right"
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
                <AppEmptyState v-if="!hasSearched" label="Lance une recherche pour explorer les stations"
                    description="Nom, région, niveau, budget..." icon="i-lucide-mountain-snow" dashed />

                <!-- Loading -->
                <AppLoader v-else-if="loadingSearch" size="lg" label="Recherche en cours..." />

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
                            :is-favorite="favoriteIds.includes(station.id)" @select="$emit('selectStation', $event)"
                            @compare="$emit('compareStation', $event)"
                            @favorite="(s: Station) => $emit('toggleFavorite', s.id)" />
                    </div>
                </template>
            </div>
        </div>
    </section>
</template>