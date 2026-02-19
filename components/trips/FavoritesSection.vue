<script setup lang="ts">
import type { Station } from '@/types/station.types';

defineProps<{
    favoriteStations: Station[];
    loadingFavorites: boolean;
}>();

defineEmits<{
    toggleFavorite: [stationId: string];
}>();

</script>

<template>

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
                :is-favorite="true" @toggle-favorite="$emit('toggleFavorite', $event)" />
        </div>
    </section>
</template>