<script setup lang="ts">
import type { Station } from '@/types/station.types';

const props = defineProps<{
  station: Station & { distance?: number };
}>();

const emit = defineEmits<{
  select: [station: Station]
  compare: [station: Station]
}>();

const getLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-blue-100 text-blue-800',
    advanced: 'bg-orange-100 text-orange-800',
    expert: 'bg-red-100 text-red-800',
  };
  return colors[level] || 'bg-snow-200 text-mountain-700';
};

const getLevelEmoji = (level: string) => {
  const emojis: Record<string, string> = {
    beginner: '🟢',
    intermediate: '🔵',
    advanced: '🟠',
    expert: '🔴',
  };
  return emojis[level] || '';
};

const getDailyPassPrice = (passes: Record<string, unknown>) => {
  const fullDay = passes?.full_day as { adult?: number } | undefined;
  return fullDay?.adult ?? null;
};

const formatDailyPassPrice = (passes: Record<string, unknown>) => {
  const price = getDailyPassPrice(passes);
  return typeof price === 'number' ? `${price}€/day` : 'N/A';
};
</script>

<template>
  <div class="station-card bg-snow-50 rounded-xl shadow-card hover:shadow-card-hover transition-all p-6 cursor-pointer"
       @click="emit('select', station)">
    
    <!-- Header -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-xl font-bold text-mountain-900">{{ station.name }}</h3>
        <p class="text-sm text-mountain-600">📍 {{ station.region }}</p>
      </div>
      <button
        @click.stop="emit('compare', station)"
        class="px-3 py-1 bg-ice-100 text-ice-700 rounded-lg text-sm font-medium hover:bg-ice-200 transition-colors"
      >
        Comparer
      </button>
    </div>

    <!-- Distance (si disponible) -->
    <div v-if="station.distance" class="mb-3">
      <span class="inline-flex items-center px-3 py-1 bg-powder-100 text-powder-700 rounded-full text-sm font-medium">
        🚗 {{ Math.round(station.distance) }} km
      </span>
    </div>

    <!-- Description -->
    <p class="text-sm text-mountain-700 mb-4 line-clamp-2">{{ station.description }}</p>

    <!-- Infos clés -->
    <div class="grid grid-cols-2 gap-3 mb-4">
      <div class="bg-snow-100 rounded-lg p-3">
        <div class="text-xs text-mountain-600 mb-1">Altitude</div>
        <div class="text-sm font-semibold text-mountain-900">
          {{ station.altitudeMin }} - {{ station.altitudeMax }}m
        </div>
      </div>
      
      <div class="bg-snow-100 rounded-lg p-3">
        <div class="text-xs text-mountain-600 mb-1">Pistes</div>
        <div class="text-sm font-semibold text-mountain-900">
          {{ station.numSlopes }} pistes ({{ station.kmSlopes }}km)
        </div>
      </div>
      
      <div class="bg-snow-100 rounded-lg p-3">
        <div class="text-xs text-mountain-600 mb-1">Forfait</div>
        <div class="text-sm font-semibold text-ice-600">
          {{ formatDailyPassPrice(station.passes) }}
        </div>
      </div>
      
      <div class="bg-snow-100 rounded-lg p-3">
        <div class="text-xs text-mountain-600 mb-1">Hébergement</div>
        <div class="text-sm font-semibold text-ice-600">
          ~{{ station.avgAccommodationPrice }}€/night
        </div>
      </div>
    </div>

    <!-- Domaine -->
    <div class="mb-3">
      <span class="text-xs text-mountain-600">🏔️ Domaine :</span>
      <span class="text-sm font-medium text-mountain-800 ml-1">{{ station.skiArea }}</span>
    </div>

    <!-- Niveaux -->
    <div class="flex flex-wrap gap-2">
      <span
        v-for="level in station.level"
        :key="level"
        :class="['px-2 py-1 rounded text-xs font-medium', getLevelColor(level)]"
      >
        {{ getLevelEmoji(level) }} {{ level }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>