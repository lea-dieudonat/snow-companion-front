<script setup lang="ts">
definePageMeta({
  layout: 'default'
});

const router = useRouter();

// Callback après création de session
const handleSessionCreated = () => {
  // Redirection vers tracking après création
  router.push('/tracking');
};
</script>

<template>
  <div class="add-session-page">
    <div class="page-header">
      <h2>➕ Nouvelle Session</h2>
      <p class="page-subtitle">Log ton ride du jour !</p>
    </div>
    
    <SessionsSessionForm @sessionCreated="handleSessionCreated" />
  </div>
</template>

<style scoped>
.add-session-page {
  @apply p-4 md:p-8 max-w-2xl mx-auto;
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