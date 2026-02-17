<script setup lang="ts">
import type { StationFilters } from '@/types/station.types';

const searchQuery = ref('');
const filters = ref<StationFilters>({
  maxDistance: 300, // km
  maxLiftPassPrice: 70, // €
  maxLodgingPrice: 150, // €
  levels: [] as string[],
});

const emit = defineEmits<{
  search: [query: string, filters: StationFilters]
}>();

const handleSearch = () => {
  emit('search', searchQuery.value, filters.value);
};

// Déclencher la recherche au changement
watch([searchQuery, filters], () => {
  handleSearch();
}, { deep: true });

const levelOptions = [
  { value: 'beginner', label: '🟢 Beginner', color: 'bg-green-100 text-green-800' },
  { value: 'intermediate', label: '🔵 Intermediate', color: 'bg-blue-100 text-blue-800' },
  { value: 'advanced', label: '🟠 Advanced', color: 'bg-orange-100 text-orange-800' },
  { value: 'expert', label: '🔴 Expert', color: 'bg-red-100 text-red-800' },
];

const toggleLevel = (level: string) => {
  const index = filters.value.levels.indexOf(level);
  if (index > -1) {
    filters.value.levels.splice(index, 1);
  } else {
    filters.value.levels.push(level);
  }
};
</script>

<template>
  <div class="bg-snow-50 rounded-xl shadow-card p-6">
    <!-- Search bar -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-mountain-800 mb-2">
        🔍 Search for a resort
      </label>
      <input v-model="searchQuery" type="text" placeholder="e.g., Val Thorens, Les 2 Alpes..."
        class="w-full px-4 py-3 rounded-lg border-2 border-snow-300 focus:border-ice-500 focus:ring-2 focus:ring-ice-500/20 outline-none transition-all text-base" />
    </div>

    <!-- Filters -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-mountain-900 mb-3">Filters</h3>

      <!-- Max distance -->
      <div>
        <label class="block text-sm font-medium text-mountain-800 mb-2">
          📍 Max distance: {{ filters.maxDistance }} km
        </label>
        <USlider v-model="filters.maxDistance" :min="50" :max="500" :step="50" />
        <div class="flex justify-between text-xs text-mountain-600 mt-1">
          <span>50 km</span>
          <span>500 km</span>
        </div>
      </div>

      <!-- Lift pass price -->
      <div>
        <label class="block text-sm font-medium text-mountain-800 mb-2">
          💰 Max lift pass price: {{ filters.maxLiftPassPrice }}€/day
        </label>
        <USlider v-model="filters.maxLiftPassPrice" :min="30" :max="80" :step="5" />
        <div class="flex justify-between text-xs text-mountain-600 mt-1">
          <span>30€</span>
          <span>80€</span>
        </div>
      </div>

      <!-- Lodging price -->
      <div>
        <label class="block text-sm font-medium text-mountain-800 mb-2">
          🏨 Max lodging price: {{ filters.maxLodgingPrice }}€/night
        </label>
        <USlider v-model="filters.maxLodgingPrice" :min="50" :max="200" :step="10" />
        <div class="flex justify-between text-xs text-mountain-600 mt-1">
          <span>50€</span>
          <span>200€</span>
        </div>
      </div>

      <!-- Level -->
      <div>
        <label class="block text-sm font-medium text-mountain-800 mb-3">
          🎿 Level
        </label>
        <div class="flex flex-wrap gap-2">
          <button v-for="option in levelOptions" :key="option.value" type="button" @click="toggleLevel(option.value)"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              filters.levels.includes(option.value)
                ? option.color + ' ring-2 ring-offset-2 ring-ice-500'
                : 'bg-snow-200 text-mountain-700 hover:bg-snow-300'
            ]">
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
