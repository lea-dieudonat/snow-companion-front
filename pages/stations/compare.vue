<script setup lang="ts">
import { getLevelBadge } from '@/utils/station.utils';

definePageMeta({ layout: 'default' });

const route = useRoute();
const router = useRouter();
const { getStationById } = useStations();

// Récupérer les IDs depuis les query params
const ids = computed(() => {
    const raw = route.query.ids as string;
    return raw ? raw.split(',').filter(Boolean) : [];
});

// Charger les stations en parallèle
const { data: stations, pending, error } = await useLazyAsyncData(
    `compare-${ids.value.join('-')}`,
    () => Promise.all(ids.value.map(id => getStationById(id))),
    { watch: [ids] }
);

const stationColors = ['text-ice-500', 'text-powder-500', 'text-forest-400 dark:text-forest-300'];
const stationBgColors = ['bg-ice-50 dark:bg-ice-800/20', 'bg-powder-50 dark:bg-powder-900/20', 'bg-forest-50 dark:bg-forest-700/20'];
</script>

<template>
    <div class="min-h-screen bg-snow-50 dark:bg-mountain-900 p-4 md:p-8">
        <div class="max-w-7xl mx-auto">

            <!-- Back -->
            <UButton icon="i-lucide-arrow-left" variant="ghost" color="neutral" class="mb-6"
                @click="router.push('/trips')">
                Retour aux stations
            </UButton>

            <!-- Header -->
            <div class="text-center mb-10">
                <UIcon name="i-lucide-git-compare" class="text-5xl text-ice-500 mx-auto mb-3" />
                <h1 class="text-3xl md:text-4xl font-bold text-mountain-900 dark:text-snow-50 mb-2">
                    Comparaison de stations
                </h1>
                <p class="text-mountain-500 dark:text-mountain-400">
                    {{ ids.length }} station{{ ids.length > 1 ? 's' : '' }} comparée{{ ids.length > 1 ? 's' : '' }}
                </p>
            </div>

            <!-- Loading -->
            <div v-if="pending" class="flex items-center justify-center min-h-[40vh]">
                <div class="text-center">
                    <UIcon name="i-lucide-loader-2" class="text-6xl text-ice-400 animate-spin mx-auto mb-4" />
                    <p class="text-mountain-500 dark:text-mountain-400 text-lg">Chargement des stations...</p>
                </div>
            </div>

            <!-- Error -->
            <UAlert v-else-if="error || !stations" color="error" variant="soft" icon="i-lucide-alert-circle"
                title="Impossible de charger les stations." class="max-w-xl mx-auto" />

            <template v-else>

                <!-- Station headers (noms + liens) -->
                <div class="grid mb-8" :style="`grid-template-columns: 220px repeat(${stations.length}, 1fr)`">
                    <div /> <!-- cellule vide pour aligner avec le tableau -->
                    <div v-for="(station, i) in stations" :key="station.id" class="text-center p-4 rounded-xl mx-1"
                        :class="stationBgColors[i]">
                        <UIcon name="i-lucide-mountain-snow" class="text-2xl mb-2" :class="stationColors[i]" />
                        <h2 class="font-bold text-lg text-mountain-900 dark:text-snow-50">{{ station.name }}</h2>
                        <p
                            class="text-sm text-mountain-500 dark:text-mountain-400 flex items-center justify-center gap-1 mt-1">
                            <UIcon name="i-lucide-map-pin" class="text-xs" />
                            {{ station.region }}
                        </p>
                        <div class="flex flex-wrap gap-1 justify-center mt-2">
                            <UBadge v-for="level in station.level" :key="level" variant="soft" color="neutral"
                                size="xs">
                                {{ getLevelBadge(level) }}
                            </UBadge>
                        </div>
                        <UButton :to="`/stations/${station.id}`" variant="ghost" size="xs"
                            trailing-icon="i-lucide-external-link" class="mt-3" :class="stationColors[i]">
                            Voir la fiche
                        </UButton>
                    </div>
                </div>

                <!-- Radar Chart -->
                <UCard class="mb-8">
                    <template #header>
                        <h3 class="font-semibold text-mountain-900 dark:text-snow-50 flex items-center gap-2">
                            <UIcon name="i-lucide-radar" class="text-ice-500" />
                            Vue d'ensemble
                        </h3>
                    </template>
                    <div class="max-w-lg mx-auto py-4">
                        <TripsStationRadarChart :stations="stations" />
                    </div>
                </UCard>

                <!-- Tableau de comparaison -->
                <UCard>
                    <template #header>
                        <h3 class="font-semibold text-mountain-900 dark:text-snow-50 flex items-center gap-2">
                            <UIcon name="i-lucide-table" class="text-ice-500" />
                            Comparaison détaillée
                            <UBadge variant="soft" color="primary" size="xs">
                                🏆 = meilleur score
                            </UBadge>
                        </h3>
                    </template>

                    <TripsStationTableComparison :stations="stations" :station-colors="stationColors" />
                </UCard>

            </template>
        </div>
    </div>
</template>