<script setup lang="ts">
definePageMeta({ layout: 'default' });
const sessionListRef = ref();
</script>

<template>
  <div class="p-4 md:p-8 max-w-7xl mx-auto">
    <AppPageHeader title="Mes sessions" description="Historique de tes rides" icon="i-lucide-bar-chart-3" />

    <SessionsList ref="sessionListRef" />
  </div>
</template>