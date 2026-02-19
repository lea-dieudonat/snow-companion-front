<script setup lang="ts">
import type { Station } from '@/types/station.types';
import { useWeather, getWeatherInfo, type WeatherData, type ForecastDay } from '@/composables/useWeather';

const props = defineProps<{
    station: Station;
    isFavorite: boolean;
}>();

const emit = defineEmits<{
    toggleFavorite: [stationId: string];
}>();

const { getWeather } = useWeather();

const weather = ref<WeatherData | null>(null);
const loading = ref(true);
const error = ref(false);

// TODO: Mock % pistes ouvertes
const slopesOpen = Math.floor(Math.random() * 41) + 60;

onMounted(async () => {
    try {
        loading.value = true;
        error.value = false;
        weather.value = await getWeather(props.station.latitude, props.station.longitude);
    } catch (e) {
        error.value = true;
    } finally {
        loading.value = false;
    }
});

// Prévisions du week-end
const weekendForecast = computed<ForecastDay[]>(() => {
    if (!weather.value) return [];
    return weather.value.forecast.filter(day => {
        const date = new Date(day.date).getDay();
        return date === 6 || date === 0; // Samedi ou dimanche
    }).slice(0, 2);
});

const snowColor = (cm: number) => {
    if (cm >= 50) return 'text-ice-600';
    if (cm >= 20) return 'text-powder-600';
    if (cm > 0) return 'text-forest-600';
    return 'text-mountain-500';
};
</script>

<template>
    <UCard class="transition-all duration-200 hover:shadow-card-hover">
        <template #header>
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="font-bold text-mountain-900 dark:text-snow-50 flex items-center gap-2">
                        <UIcon name="i-lucide-mountain-snow" class="text-ice-500" />
                        {{ station.name }}
                    </h3>
                    <p class="text-xs text-mountain-500 dark:text-mountain-400 mt-0.5 flex items-center gap-1">
                        <UIcon name="i-lucide-map-pin" class="text-xs" />
                        {{ station.region }} · {{ station.altitudeMin }}m – {{ station.altitudeMax }}m
                    </p>
                </div>
                <div class="flex items-center gap-1">
                    <UButton :icon="isFavorite ? 'i-lucide-heart' : 'i-lucide-heart'"
                        :color="isFavorite ? 'error' : 'neutral'" :variant="isFavorite ? 'soft' : 'ghost'" size="xs"
                        @click="emit('toggleFavorite', station.id)" />
                    <UButton icon="i-lucide-external-link" color="neutral" variant="ghost" size="xs"
                        :to="`/stations/${station.id}`" />
                </div>
            </div>
        </template>

        <!-- Loading -->
        <AppLoader v-if="loading" size="sm" />

        <!-- Error -->
        <div v-else-if="error" class="text-center py-4 text-mountain-400 text-sm">
            <UIcon name="i-lucide-wifi-off" class="mb-1" />
            <p>Météo indisponible</p>
        </div>

        <!-- Météo -->
        <div v-else-if="weather" class="space-y-4">
            <!-- Météo actuelle -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <UIcon :name="getWeatherInfo(weather.weathercode).icon" class="text-3xl text-ice-400" />
                    <div>
                        <p class="text-2xl font-bold text-mountain-900 dark:text-snow-50">{{ weather.temperature }}°C
                        </p>
                        <p class="text-xs text-mountain-500">{{ getWeatherInfo(weather.weathercode).label }}</p>
                    </div>
                </div>
                <div class="text-right space-y-1">
                    <div class="flex items-center gap-1 text-xs text-mountain-500 justify-end">
                        <UIcon name="i-lucide-wind" class="text-xs" />
                        {{ weather.windspeed }} km/h
                    </div>
                    <div class="flex items-center gap-1 text-xs justify-end" :class="snowColor(weather.snowfall)">
                        <UIcon name="i-lucide-snowflake" class="text-xs" />
                        {{ weather.snowfall }} cm aujourd'hui
                    </div>
                </div>
            </div>

            <!-- % pistes ouvertes (mock) -->
            <div>
                <div class="flex justify-between text-xs text-mountain-600 dark:text-mountain-400 mb-1">
                    <span class="flex items-center gap-1">
                        <UIcon name="i-lucide-route" />
                        Pistes ouvertes
                    </span>
                    <span class="font-semibold" :class="slopesOpen >= 80 ? 'text-green-500' : 'text-powder-500'">
                        {{ slopesOpen }}% <span class="text-mountain-400 font-normal">(estimé)</span>
                    </span>
                </div>
                <UProgress :value="slopesOpen" :color="slopesOpen >= 80 ? 'success' : 'warning'" size="xs" />
            </div>

            <!-- Prévisions week-end -->
            <div v-if="weekendForecast.length > 0">
                <p class="text-xs font-semibold text-mountain-600 dark:text-mountain-400 mb-2 flex items-center gap-1">
                    <UIcon name="i-lucide-calendar" />
                    Week-end
                </p>
                <div class="grid grid-cols-2 gap-2">
                    <div v-for="day in weekendForecast" :key="day.date"
                        class="bg-snow-100 dark:bg-mountain-700/50 rounded-lg p-2 text-center">
                        <p class="text-xs text-mountain-500 mb-1">
                            {{ new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' }) }}
                        </p>
                        <UIcon :name="getWeatherInfo(day.weathercode).icon" class="text-ice-400 mb-1" />
                        <p class="text-xs font-semibold text-mountain-800 dark:text-mountain-200">
                            {{ day.temperature_max }}° / {{ day.temperature_min }}°
                        </p>
                        <p class="text-xs flex items-center justify-center gap-0.5" :class="snowColor(day.snowfall)">
                            <UIcon name="i-lucide-snowflake" class="text-xs" />
                            {{ day.snowfall }} cm
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </UCard>
</template>