<script setup lang="ts">
import type { StationFilters } from '@/types/station.types';
import { levelOptions } from '@/utils/station.utils';

const searchQuery = ref('');
const filters = ref<StationFilters>({
  maxDistance: 300,
  maxLiftPassPrice: 70,
  maxLodgingPrice: 150,
  levels: [] as string[],
});

const emit = defineEmits<{
  search: [query: string, filters: StationFilters]
}>();

const handleSearch = () => {
  emit('search', searchQuery.value, filters.value);
};

watch([searchQuery, filters], handleSearch, { deep: true });

const toggleLevel = (level: string) => {
  const index = filters.value.levels.indexOf(level);
  if (index > -1) {
    filters.value.levels.splice(index, 1);
  } else {
    filters.value.levels.push(level);
  }
};

const isLevelSelected = (level: string) => filters.value.levels.includes(level);
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold text-mountain-900 dark:text-snow-50 flex items-center gap-2">
        <UIcon name="i-lucide-sliders-horizontal" />
        Recherche &amp; Filtres
      </h3>
    </template>

    <div class="space-y-6">
      <!-- Search bar -->
      <UFormField label="Rechercher une station">
        <UInput v-model="searchQuery" icon="i-lucide-mountain" placeholder="Ex: Val Thorens, Les 2 Alpes..."
          size="lg" />
      </UFormField>

      <UDivider label="Filtres" />

      <!-- Max distance -->
      <UFormField :label="`📍 Distance max : ${filters.maxDistance} km`">
        <input v-model.number="filters.maxDistance" type="range" min="50" max="500" step="50"
          class="w-full h-2 bg-snow-200 dark:bg-mountain-700 rounded-lg appearance-none cursor-pointer accent-ice-500" />
        <div class="flex justify-between text-xs text-mountain-600 dark:text-mountain-400 mt-1">
          <span>50 km</span>
          <span>500 km</span>
        </div>
      </UFormField>

      <!-- Lift pass price -->
      <UFormField :label="`💰 Forfait max : ${filters.maxLiftPassPrice}€/jour`">
        <input v-model.number="filters.maxLiftPassPrice" type="range" min="30" max="80" step="5"
          class="w-full h-2 bg-snow-200 dark:bg-mountain-700 rounded-lg appearance-none cursor-pointer accent-ice-500" />
        <div class="flex justify-between text-xs text-mountain-600 dark:text-mountain-400 mt-1">
          <span>30€</span>
          <span>80€</span>
        </div>
      </UFormField>

      <!-- Lodging price -->
      <UFormField :label="`🏨 Hébergement max : ${filters.maxLodgingPrice}€/nuit`">
        <input v-model.number="filters.maxLodgingPrice" type="range" min="50" max="300" step="10"
          class="w-full h-2 bg-snow-200 dark:bg-mountain-700 rounded-lg appearance-none cursor-pointer accent-ice-500" />
        <div class="flex justify-between text-xs text-mountain-600 dark:text-mountain-400 mt-1">
          <span>50€</span>
          <span>300€</span>
        </div>
      </UFormField>

      <!-- Niveau -->
      <UFormField label="Niveau de difficulté">
        <div class="flex flex-wrap gap-2">
          <UButton v-for="option in levelOptions" :key="option.value"
            :color="isLevelSelected(option.value) ? 'primary' : 'neutral'"
            :variant="isLevelSelected(option.value) ? 'solid' : 'outline'" size="sm" @click="toggleLevel(option.value)">
            {{ option.label }}
          </UButton>
        </div>
      </UFormField>
    </div>
  </UCard>
</template>