<script setup lang="ts">
definePageMeta({
  layout: 'default'
});
</script>

<template>
  <div class="trips-page">
    <div class="page-header">
      <h2>🗺️ Planning Trips</h2>
      <p class="page-subtitle">Trouve ta prochaine destination !</p>
    </div>
    
    <div class="placeholder">
      <div class="placeholder-icon">🏔️</div>
      <h3>Bientôt disponible !</h3>
      <p>La recherche et comparaison de stations arrive très bientôt...</p>
      
      <div class="features-preview">
        <div class="feature-item">
          <span class="feature-icon">📍</span>
          <span>Distance & itinéraire</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">☀️</span>
          <span>Météo & enneigement</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">💰</span>
          <span>Prix forfaits & hébergements</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🎿</span>
          <span>Domaine & niveau</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trips-page {
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

.placeholder {
  @apply bg-snow-50 rounded-xl p-12 md:p-16 text-center shadow-card;
}

.placeholder-icon {
  @apply text-6xl mb-4;
}

.placeholder h3 {
  @apply text-ice-600 text-3xl font-bold m-0 mb-4;
}

.placeholder p {
  @apply text-mountain-700 text-lg m-0 mb-8;
}

.features-preview {
  @apply grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8;
}

.feature-item {
  @apply flex items-center gap-3 p-4 bg-ice-100/50 rounded-lg border border-ice-200 transition-all hover:bg-ice-100 hover:-translate-y-0.5;
}

.feature-icon {
  @apply text-2xl;
}

.feature-item span:last-child {
  @apply font-medium text-mountain-800 text-base;
}
</style>