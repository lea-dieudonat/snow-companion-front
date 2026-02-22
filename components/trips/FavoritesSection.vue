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
        <h3 class="heading-section mb-4">
            <UIcon name="i-lucide-heart" class="text-red-400" />
            Mes stations favorites
        </h3>

        <AppLoader v-if="loadingFavorites" />

        <AppEmptyState v-else-if="favoriteStations.length === 0" label="Aucune station favorite pour l'instant"
            description="Recherche une station ci-dessous et ajoute-la à tes favoris ❤️" icon="i-lucide-heart" dashed />

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <TripsWeatherStationCard v-for="station in favoriteStations" :key="station.id" :station="station"
                :is-favorite="true" @toggle-favorite="$emit('toggleFavorite', $event)" />
        </div>
    </section>
</template>