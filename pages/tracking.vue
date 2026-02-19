<script setup lang="ts">
definePageMeta({ layout: 'default' });
const sessionListRef = ref();
</script>

<template>
  <div class="p-4 md:p-8 max-w-7xl mx-auto">
    <div class="mb-8 text-center">
      <UIcon name="i-lucide-bar-chart-3" class="text-5xl text-ice-500 mx-auto mb-4" />
      <h2 class="text-mountain-900 dark:text-snow-50 text-3xl md:text-4xl font-bold m-0 mb-2">Mes Sessions</h2>
      <p class="text-mountain-500 dark:text-mountain-300 text-base m-0">Historique de tes rides</p>
    </div>

    <SessionsList ref="sessionListRef" />
  </div>
</template>