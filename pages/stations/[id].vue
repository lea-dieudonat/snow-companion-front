<script setup lang="ts">
import type { Station } from '@/types/station.types';
import {
    getDailyPassPrice,
    getSlopesBreakdown,
    getSeasonDates,
    getAccessInfo,
    slopeColors,
    getSlopeColorLabel,
    getLevelBadge,
    getLevelBadgeClass
} from '@/utils/station.utils';

definePageMeta({ layout: 'default' });

const route = useRoute();
const router = useRouter();
const { getStationById } = useStations();

const stationId = route.params.id as string;

const { data: station, error, pending } = await useLazyAsyncData(
    `station-${stationId}`,
    () => getStationById(stationId)
);
</script>

<template>
    <div class="min-h-screen bg-snow-50 dark:bg-mountain-900">
        <!-- Loading state -->
        <AppLoader v-if="pending" size="lg" label="Chargement de la station..." />

        <!-- Error state -->
        <div v-else-if="error || !station" class="p-4 md:p-8">
            <UAlert color="error" variant="soft" icon="i-lucide-alert-circle" title="Erreur"
                description="Impossible de charger les informations de cette station." class="max-w-2xl mx-auto">
                <template #actions>
                    <UButton color="error" variant="outline" @click="router.push('/trips')">
                        Retour aux stations
                    </UButton>
                </template>
            </UAlert>
        </div>

        <!-- Station content -->
        <div v-else class="p-4 md:p-8">
            <!-- Back button -->
            <div class="max-w-7xl mx-auto mb-6">
                <UButton icon="i-lucide-arrow-left" variant="ghost" color="neutral" @click="router.push('/trips')">
                    Retour aux stations
                </UButton>
            </div>

            <!-- Hero section -->
            <div class="max-w-7xl mx-auto mb-8">
                <div
                    class="bg-linear-to-br from-ice-500 to-ice-700 dark:from-ice-700 dark:to-ice-900 rounded-2xl p-8 md:p-12 text-white shadow-xl">
                    <div class="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h1 class="text-4xl md:text-5xl font-bold mb-3 flex items-center gap-3">
                                <UIcon name="i-lucide-mountain-snow" class="text-5xl" />
                                {{ station.name }}
                            </h1>
                            <p class="text-xl text-ice-100 flex items-center gap-2 mb-4">
                                <UIcon name="i-lucide-map-pin" />
                                {{ station.region }} · {{ station.skiArea }}
                            </p>
                            <div class="flex items-center gap-2 text-ice-50">
                                <UIcon name="i-lucide-mountain" />
                                <span class="text-lg font-medium">{{ station.altitudeMin }}m - {{ station.altitudeMax
                                }}m</span>
                            </div>
                        </div>

                        <UButton color="neutral" variant="solid" size="lg" trailing-icon="i-lucide-calendar-plus"
                            class="bg-white text-ice-600 hover:bg-snow-100 shadow-lg font-semibold">
                            Planifier un trip
                        </UButton>
                    </div>
                </div>
            </div>

            <!-- Main content -->
            <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Left column - Main info -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Key stats cards -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <UCard>
                            <div class="text-center">
                                <UIcon name="i-lucide-ticket" class="text-3xl text-ice-500 mx-auto mb-2" />
                                <p class="text-sm text-mountain-600 dark:text-mountain-400 mb-1">Forfait jour</p>
                                <p class="text-2xl font-bold text-mountain-900 dark:text-snow-50">
                                    {{ getDailyPassPrice(station.passes) ? `${getDailyPassPrice(station.passes)}€` :
                                        'N/A' }}
                                </p>
                            </div>
                        </UCard>

                        <UCard>
                            <div class="text-center">
                                <UIcon name="i-lucide-bed" class="text-3xl text-powder-500 mx-auto mb-2" />
                                <p class="text-sm text-mountain-600 dark:text-mountain-400 mb-1">Hébergement</p>
                                <p class="text-2xl font-bold text-mountain-900 dark:text-snow-50">
                                    {{ station.avgAccommodationPrice }}€
                                </p>
                                <p class="text-xs text-mountain-500 dark:text-mountain-400">/nuit</p>
                            </div>
                        </UCard>

                        <UCard>
                            <div class="text-center">
                                <UIcon name="i-lucide-route" class="text-3xl text-forest-400 mx-auto mb-2" />
                                <p class="text-sm text-mountain-600 dark:text-mountain-400 mb-1">Pistes</p>
                                <p class="text-2xl font-bold text-mountain-900 dark:text-snow-50">
                                    {{ station.kmSlopes }} km
                                </p>
                                <p class="text-xs text-mountain-500 dark:text-mountain-400">{{ station.numSlopes }}
                                    pistes</p>
                            </div>
                        </UCard>

                        <UCard>
                            <div class="text-center">
                                <UIcon name="i-lucide-cable-car" class="text-3xl text-mountain-500 mx-auto mb-2" />
                                <p class="text-sm text-mountain-600 dark:text-mountain-400 mb-1">Remontées</p>
                                <p class="text-2xl font-bold text-mountain-900 dark:text-snow-50">
                                    {{ station.numLifts }}
                                </p>
                            </div>
                        </UCard>
                    </div>

                    <!-- Description -->
                    <UCard>
                        <template #header>
                            <h3 class="text-xl font-bold text-mountain-900 dark:text-snow-50 flex items-center gap-2">
                                <UIcon name="i-lucide-info" />
                                À propos
                            </h3>
                        </template>
                        <p class="text-mountain-700 dark:text-mountain-300 leading-relaxed">
                            {{ station.description }}
                        </p>
                    </UCard>

                    <!-- Slopes breakdown -->
                    <UCard>
                        <template #header>
                            <h3 class="text-xl font-bold text-mountain-900 dark:text-snow-50 flex items-center gap-2">
                                <UIcon name="i-lucide-activity" />
                                Détail des pistes
                            </h3>
                        </template>

                        <div class="space-y-4">
                            <div v-for="(count, color) in getSlopesBreakdown(station.slopesDetail)" :key="color">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="font-medium capitalize"
                                        :class="slopeColors[color as keyof typeof slopeColors].text">
                                        {{ color === 'green' ? 'Vertes' : color === 'blue' ? 'Bleues' : color === 'red'
                                            ?
                                            'Rouges' : 'Noires' }}
                                    </span>
                                    <span class="text-sm text-mountain-600 dark:text-mountain-400">{{ count }}
                                        pistes</span>
                                </div>
                                <div class="w-full bg-snow-200 dark:bg-mountain-700 rounded-full h-3 overflow-hidden">
                                    <div :class="slopeColors[color as keyof typeof slopeColors].bg"
                                        class="h-full rounded-full transition-all duration-500"
                                        :style="{ width: `${(count / station.numSlopes) * 100}%` }"></div>
                                </div>
                            </div>
                        </div>
                    </UCard>

                    <!-- Access -->
                    <UCard>
                        <template #header>
                            <h3 class="text-xl font-bold text-mountain-900 dark:text-snow-50 flex items-center gap-2">
                                <UIcon name="i-lucide-navigation" />
                                Accès
                            </h3>
                        </template>

                        <div class="space-y-4">
                            <div class="flex items-start gap-3">
                                <UIcon name="i-lucide-plane" class="text-2xl text-ice-500 mt-1" />
                                <div class="flex-1">
                                    <p class="font-semibold text-mountain-900 dark:text-snow-50 mb-1">Aéroport</p>
                                    <p class="text-mountain-700 dark:text-mountain-300 text-sm">
                                        {{ getAccessInfo(station.access).airport }}
                                    </p>
                                </div>
                            </div>

                            <UDivider />

                            <div class="flex items-start gap-3">
                                <UIcon name="i-lucide-train-front" class="text-2xl text-ice-500 mt-1" />
                                <div class="flex-1">
                                    <p class="font-semibold text-mountain-900 dark:text-snow-50 mb-1">Gare</p>
                                    <p class="text-mountain-700 dark:text-mountain-300 text-sm">
                                        {{ getAccessInfo(station.access).train }}
                                    </p>
                                </div>
                            </div>

                            <UDivider />

                            <div class="flex items-start gap-3">
                                <UIcon name="i-lucide-car" class="text-2xl text-ice-500 mt-1" />
                                <div class="flex-1">
                                    <p class="font-semibold text-mountain-900 dark:text-snow-50 mb-1">Parking</p>
                                    <p class="text-mountain-700 dark:text-mountain-300 text-sm">
                                        {{ getAccessInfo(station.access).parking ? 'Disponible' : 'Non disponible' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </UCard>
                </div>

                <!-- Right column - Sidebar -->
                <div class="lg:col-span-1 space-y-6">
                    <!-- Season -->
                    <UCard>
                        <template #header>
                            <h3 class="text-lg font-bold text-mountain-900 dark:text-snow-50 flex items-center gap-2">
                                <UIcon name="i-lucide-calendar" />
                                Saison
                            </h3>
                        </template>
                        <p class="text-mountain-700 dark:text-mountain-300">
                            {{ getSeasonDates(station.season) }}
                        </p>
                    </UCard>

                    <!-- Level badges -->
                    <UCard>
                        <template #header>
                            <h3 class="text-lg font-bold text-mountain-900 dark:text-snow-50 flex items-center gap-2">
                                <UIcon name="i-lucide-target" />
                                Niveau
                            </h3>
                        </template>
                        <div class="flex flex-wrap gap-2">
                            <UBadge v-for="level in station.level" :key="level" :class="getLevelBadgeClass(level)">
                                {{ getLevelBadge(level) }}
                            </UBadge>
                        </div>
                    </UCard>

                    <!-- Services -->
                    <UCard v-if="station.services.length > 0">
                        <template #header>
                            <h3 class="text-lg font-bold text-mountain-900 dark:text-snow-50 flex items-center gap-2">
                                <UIcon name="i-lucide-sparkles" />
                                Services
                            </h3>
                        </template>
                        <ul class="space-y-2">
                            <li v-for="service in station.services" :key="service"
                                class="flex items-center gap-2 text-mountain-700 dark:text-mountain-300">
                                <UIcon name="i-lucide-check-circle"
                                    class="text-forest-500 dark:text-forest-300 shrink-0" />
                                <span class="capitalize">{{ service }}</span>
                            </li>
                        </ul>
                    </UCard>

                    <!-- Activities -->
                    <UCard v-if="station.activities.length > 0">
                        <template #header>
                            <h3 class="text-lg font-bold text-mountain-900 dark:text-snow-50 flex items-center gap-2">
                                <UIcon name="i-lucide-zap" />
                                Activités
                            </h3>
                        </template>
                        <ul class="space-y-2">
                            <li v-for="activity in station.activities" :key="activity"
                                class="flex items-center gap-2 text-mountain-700 dark:text-mountain-300">
                                <UIcon name="i-lucide-star" class="text-powder-500 shrink-0" />
                                <span class="capitalize">{{ activity }}</span>
                            </li>
                        </ul>
                    </UCard>

                    <!-- Website link -->
                    <UCard>
                        <UButton :to="station.website" target="_blank" color="primary" block
                            trailing-icon="i-lucide-external-link">
                            Site officiel
                        </UButton>
                    </UCard>
                </div>
            </div>
        </div>
    </div>
</template>