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
  <div class="p-4 md:p-8 max-w-7xl mx-auto">
    <div class="mb-8 text-center">
      <h2 class="text-snow-50 text-3xl md:text-4xl font-bold m-0 mb-2 drop-shadow-lg">📊 Mes Sessions</h2>
      <p class="text-snow-100 text-base m-0">Historique de tes rides</p>
    </div>
    <UButton icon="i-lucide-mountain" color="primary">
      Test Nuxt UI
    </UButton>
    <SessionsSessionList ref="sessionListRef" />
  </div>
</template>
