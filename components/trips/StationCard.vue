<script setup lang="ts">
import type { Station } from '@/types/station.types';

const props = defineProps<{
  station: Station & { distance?: number };
}>();

const emit = defineEmits<{
  select: [station: Station]
  compare: [station: Station]
}>();

// On mappe les niveaux sur les couleurs sémantiques du thème
const getLevelBadgeClass = (level: string) => {
  const classes: Record<string, string> = {
    beginner: 'bg-ice-100 text-ice-700',
    intermediate: 'bg-mountain-100 text-mountain-700',
    advanced: 'bg-powder-100 text-powder-700',
    expert: 'bg-powder-200 text-powder-900',
  };
  return classes[level] || 'bg-snow-200 text-mountain-700';
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

const getLevelLabel = (level: string) => {
  const labels: Record<string, string> = {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé',
    expert: 'Expert',
  };
  return labels[level] || level;
};

const getDailyPassPrice = (passes: Record<string, unknown>) => {
  const fullDay = passes?.full_day as { adult?: number } | undefined;
  return fullDay?.adult ?? null;
};

const formatDailyPassPrice = (passes: Record<string, unknown>) => {
  const price = getDailyPassPrice(passes);
  return typeof price === 'number' ? `${price}€` : 'N/A';
};
</script>

<template>
  <UCard class="transition-all duration-200 hover:scale-[1.01] hover:shadow-card-hover cursor-pointer">
    <template #header>
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h3 class="text-xl font-bold text-mountain-900 flex items-center gap-2">
            <UIcon name="i-lucide-mountain-snow" />
            {{ station.name }}
          </h3>
          <p class="text-sm text-mountain-600 flex items-center gap-1 mt-1">
            <UIcon name="i-lucide-map-pin" class="text-xs" />
            {{ station.region }}
          </p>
        </div>
        <UButton icon="i-lucide-git-compare" color="neutral" variant="ghost" size="xs"
          aria-label="Ajouter à la comparaison" @click.stop="emit('compare', station)" />
      </div>
    </template>

    <div class="space-y-3">
      <!-- Distance -->
      <div v-if="station.distance" class="flex items-center gap-2 text-sm text-mountain-700">
        <UIcon name="i-lucide-navigation" class="text-ice-500" />
        <span class="font-medium">{{ Math.round(station.distance) }} km</span>
      </div>

      <!-- Altitude -->
      <div class="flex items-center gap-2 text-sm text-mountain-700">
        <UIcon name="i-lucide-trending-up" class="text-ice-500" />
        <span>{{ station.altitudeMin }}m – {{ station.altitudeMax }}m</span>
      </div>

      <!-- Pistes -->
      <div class="flex items-center gap-2 text-sm text-mountain-700">
        <UIcon name="i-lucide-route" class="text-ice-500" />
        <span>{{ station.numSlopes }} pistes · {{ station.kmSlopes }} km</span>
      </div>

      <!-- Prix forfait & hébergement -->
      <div class="grid grid-cols-2 gap-2 pt-1">
        <div class="bg-ice-100/50 rounded-lg p-3">
          <div class="flex items-center gap-1 text-xs text-mountain-600 mb-1">
            <UIcon name="i-lucide-ticket" />
            Forfait/jour
          </div>
          <span class="text-base font-bold text-ice-700">{{ formatDailyPassPrice(station.passes) }}</span>
        </div>
        <div class="bg-mountain-100/50 rounded-lg p-3">
          <div class="flex items-center gap-1 text-xs text-mountain-600 mb-1">
            <UIcon name="i-lucide-hotel" />
            Hébergement/nuit
          </div>
          <span class="text-base font-bold text-mountain-700">{{ station.avgAccommodationPrice }}€</span>
        </div>
      </div>

      <!-- Niveaux -->
      <div class="flex flex-wrap gap-2 pt-1">
        <span v-for="level in station.level" :key="level"
          :class="['inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', getLevelBadgeClass(level)]">
          {{ getLevelEmoji(level) }} {{ getLevelLabel(level) }}
        </span>
      </div>
    </div>

    <template #footer>
      <UButton color="primary" block icon="i-lucide-eye" @click="emit('select', station)">
        Voir les détails
      </UButton>
    </template>
  </UCard>
</template>