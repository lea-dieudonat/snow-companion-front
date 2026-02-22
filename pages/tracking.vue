<script setup lang="ts">
definePageMeta({ layout: 'default' });
const sessionListRef = ref();
</script>

<template>
  <div class="page-container">
    <AppPageHeader title="Mes sessions" description="Historique de tes rides" icon="i-lucide-bar-chart-3" />

    <SessionsList ref="sessionListRef" />
  </div>
</template>