<script setup lang="ts">
definePageMeta({
  layout: 'default'
});

const sessionListRef = ref();

// Callback pour rafraîchir la liste des sessions après création
const handleSessionCreated = () => {
  sessionListRef.value?.fetchSessions();
};
</script>

<template>
  <div class="tracking-page">
    <div class="page-header">
      <h2>📊 Mes Sessions</h2>
      <p class="page-subtitle">Historique de tes rides</p>
    </div>
    <UButton icon="i-lucide-mountain" color="primary">
      Test Nuxt UI
    </UButton>
    <SessionsSessionList ref="sessionListRef" />
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";
.tracking-page {
  @apply p-4 md:p-8 max-w-7xl mx-auto;
}

.page-header {
  @apply mb-8 text-center;
}

.page-header h2 {
  @apply text-snow-50 text-3xl md:text-4xl font-bold m-0 mb-2 drop-shadow-lg;
}

.page-subtitle {
  @apply text-snow-100 text-base m-0;
}
</style>