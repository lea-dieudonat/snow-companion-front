<script setup lang="ts">
import type { Station } from '@/types/station.types';
import {
  getDailyPassPrice,
  getSlopesBreakdown,
  getSeasonDates,
  getAccessInfo,
  slopeColors,
  getSlopeColorLabel,
  getLevelBadgeClass,
} from '@/utils/station.utils';

const props = defineProps<{
  station: Station & { distance?: number };
  isFavorite?: boolean;
}>();

const emit = defineEmits<{
  select: [station: Station];
  compare: [station: Station];
  favorite: [station: Station];
}>();
</script>

<template>
  <UCard class="transition-all duration-200 hover:scale-[1.01] hover:shadow-card-hover cursor-pointer">
    <template #header>
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h3 class="heading-section">
            <UIcon name="i-lucide-mountain-snow" />
            {{ station.name }}
          </h3>
          <p class="text-sm text-mountain-600 dark:text-mountain-300 flex items-center gap-1 mt-1">
            <UIcon name="i-lucide-map-pin" class="text-xs" />
            {{ station.region }}
          </p>
        </div>
        <div class="flex items-center gap-1">
          <UButton :icon="isFavorite ? 'i-lucide-heart' : 'i-lucide-heart'" :color="isFavorite ? 'error' : 'neutral'"
            :variant="isFavorite ? 'soft' : 'ghost'" size="xs" aria-label="Ajouter aux favoris"
            @click.stop="emit('favorite', station)" />
          <UButton icon="i-lucide-git-compare" color="neutral" variant="ghost" size="xs"
            aria-label="Ajouter à la comparaison" @click.stop="emit('compare', station)" />
        </div>
      </div>
    </template>

    <div class="space-y-3">
      <!-- Distance -->
      <div v-if="station.distance" class="flex items-center gap-2 text-sm text-mountain-700 dark:text-mountain-300">
        <UIcon name="i-lucide-navigation" class="text-ice-500" />
        <span class="font-medium">{{ Math.round(station.distance) }} km</span>
      </div>

      <!-- Altitude -->
      <div class="info-item">
        <UIcon name="i-lucide-trending-up" class="text-ice-500" />
        <span>{{ station.altitudeMin }}m – {{ station.altitudeMax }}m</span>
      </div>

      <!-- Pistes -->
      <div class="info-item">
        <UIcon name="i-lucide-route" class="text-ice-500" />
        <span>{{ station.numSlopes }} pistes · {{ station.kmSlopes }} km</span>
      </div>

      <!-- Prix forfait & hébergement -->
      <div class="grid grid-cols-2 gap-2 pt-1">
        <div class="bg-ice-100/50 dark:bg-ice-900/30 rounded-lg p-3">
          <div class="icon-label mb-1">
            <UIcon name="i-lucide-ticket" />
            Forfait/jour
          </div>
          <span class="text-base font-bold text-ice-700 dark:text-ice-400">{{ formatDailyPassPrice(station.passes)
          }}</span>
        </div>
        <div class="bg-mountain-100/50 dark:bg-mountain-700/30 rounded-lg p-3">
          <div class="icon-label mb-1">
            <UIcon name="i-lucide-hotel" />
            Hébergement/nuit
          </div>
          <span class="text-base font-bold text-mountain-700 dark:text-mountain-300">{{ station.avgAccommodationPrice
          }}€</span>
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