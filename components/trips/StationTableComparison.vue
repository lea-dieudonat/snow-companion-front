<script setup lang="ts">
import type { Station } from '@/types/station.types';

const props = defineProps<{
  stations: Station[];
  stationColors: string[];
}>();

const stationsRef = computed(() => props.stations);
const { tableRows } = useStationComparison(stationsRef);
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="border-b border-mountain-100 dark:border-mountain-700">
          <th class="table-header w-48">
            Critère
          </th>
          <th v-for="(station, i) in stations" :key="station.id"
            class="text-center py-3 px-4 text-sm font-semibold" :class="stationColors[i]">
            {{ station.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(row, rowIdx) in tableRows" :key="rowIdx">
          <!-- Section header -->
          <tr v-if="row.section"
            class="bg-mountain-50 dark:bg-mountain-800/50 border-t border-mountain-100 dark:border-mountain-700">
            <td :colspan="stations.length + 1"
              class="py-2 px-4 text-xs font-bold uppercase tracking-wider text-mountain-500 dark:text-mountain-400">
              {{ row.section }}
            </td>
          </tr>
          <!-- Data row -->
          <tr
            class="border-b border-mountain-50 dark:border-mountain-800 hover:bg-snow-100 dark:hover:bg-mountain-800/30 transition-colors">
            <td class="table-cell font-medium">
              {{ row.label }}
            </td>
            <td v-for="(value, colIdx) in row.values" :key="colIdx"
              class="py-3 px-4 text-sm text-center text-mountain-800 dark:text-mountain-200">
              <span v-if="row.winner === colIdx"
                class="font-bold flex items-center justify-center gap-1"
                :class="stationColors[colIdx]">
                🏆 {{ value }}
              </span>
              <span v-else>{{ value }}</span>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
