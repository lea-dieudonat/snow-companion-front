<script setup lang="ts">
definePageMeta({
  layout: 'default'
});

// Redirection automatique vers la page Trips (notre home par défaut)
const router = useRouter();

onMounted(() => {
  router.push('/trips');
});
</script>

<template>
  <div class="redirect-page">
    <div class="loading">
      <div class="spinner"></div>
      <p>Chargement...</p>
    </div>
  </div>
</template>

<style scoped>
.redirect-page {
  @apply flex items-center justify-center min-h-[50vh];
}

.loading {
  @apply text-center;
}

.spinner {
  @apply w-12 h-12 mx-auto mb-4 border-4 border-snow-100/30 border-t-snow-50 rounded-full animate-spin;
}

.loading p {
  @apply text-snow-50 text-xl;
}
</style>