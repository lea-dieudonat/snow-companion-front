<script setup lang="ts">
definePageMeta({ layout: 'default' });
const sessionListRef = ref();
</script>

<template>
  <div class="p-4 md:p-8 max-w-7xl mx-auto">
    <div class="mb-8 text-center">
      <UIcon name="i-lucide-bar-chart-3" class="text-5xl text-snow-50 mx-auto mb-4" />
      <h2 class="text-snow-50 text-3xl md:text-4xl font-bold m-0 mb-2 drop-shadow-lg">Mes Sessions</h2>
      <p class="text-snow-100 text-base m-0">Historique de tes rides</p>
    </div>

    <SessionsSessionList ref="sessionListRef" />
  </div>
</template>