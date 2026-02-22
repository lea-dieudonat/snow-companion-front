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
  <UCard class="overflow-hidden">
    <template #header>
      <div class="flex items-center gap-2">
        <div class="p-1.5 rounded-lg bg-ice-500/10">
          <UIcon name="i-lucide-sliders-horizontal" class="text-ice-500 text-lg" />
        </div>
        <h3 class="heading-subsection">Recherche & Filtres</h3>
      </div>
    </template>

    <div class="space-y-6">
      <!-- Search bar -->
      <UFormField label="Station">
        <UInput v-model="searchQuery" icon="i-lucide-mountain-snow" placeholder="Val Thorens, Les 2 Alpes..." size="lg"
          class="w-full" />
      </UFormField>

      <UDivider />

      <!-- Max distance -->
      <AppRangeFilter icon="i-lucide-map-pin" label="Distance max"
        v-model="filters.maxDistance" :min="50" :max="500" :step="50"
        value-suffix=" km" min-label="50 km" max-label="500 km" />

      <!-- Lift pass price -->
      <AppRangeFilter icon="i-lucide-ticket" label="Forfait max"
        v-model="filters.maxLiftPassPrice" :min="30" :max="80" :step="5"
        value-suffix="€/jour" min-label="30€" max-label="80€" />

      <!-- Lodging price -->
      <AppRangeFilter icon="i-lucide-bed" label="Hébergement max"
        v-model="filters.maxLodgingPrice" :min="50" :max="300" :step="10"
        value-suffix="€/nuit" min-label="50€" max-label="300€" />

      <!-- Niveau -->
      <UFormField>
        <template #label>
          <div class="flex items-center gap-1.5 text-sm font-medium text-mountain-700 dark:text-mountain-300">
            <UIcon name="i-lucide-flag" class="text-ice-500" />
            Niveau de difficulté
          </div>
        </template>
        <div class="flex flex-wrap gap-2">
          <UButton v-for="option in levelOptions" :key="option.value"
            :color="isLevelSelected(option.value) ? 'primary' : 'neutral'"
            :variant="isLevelSelected(option.value) ? 'solid' : 'outline'" size="sm" @click="toggleLevel(option.value)">
            {{ option.label }}
          </UButton>
        </div>
      </UFormField>
    </div>

    <template #footer>
      <UButton block size="lg" color="neutral" variant="solid" leading-icon="i-lucide-search" class="relative overflow-hidden group
               bg-mountain-800 hover:bg-mountain-900
               dark:bg-mountain-700 dark:hover:bg-mountain-600
               border border-mountain-600 dark:border-mountain-500
               transition-all duration-200" @click="handleSearch">
        <span class="relative z-10">Rechercher</span>
        <span class="absolute inset-y-0 left-1/2 -translate-x-1/2 w-24
                 bg-green-500/20 blur-xl rounded-full
                 group-hover:w-40 transition-all duration-300" />
      </UButton>
    </template>
  </UCard>
</template>