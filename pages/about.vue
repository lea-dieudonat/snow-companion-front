<script setup lang="ts">
definePageMeta({
  layout: 'default'
});
</script>

<template>
  <div class="about-page">
    <div class="page-header">
      <h2>ℹ️ À propos</h2>
    </div>
    
    <div class="content">
      <h3>🏂 Snow Companion</h3>
      <p>
        Ton compagnon ultime pour tracker tes sessions de snowboard et ski,
        et planifier tes prochaines aventures en montagne ! ⛰️
      </p>
      
      <div class="version">
        <strong>Version:</strong> 1.0.0-beta
      </div>
      
      <div class="credits">
        <p>Développé avec ❤️ pour les riders</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";
.about-page {
  @apply p-4 max-w-4xl mx-auto;
}

.page-header h2 {
  @apply text-snow-50 text-3xl font-bold m-0 mb-8 drop-shadow-lg text-center;
}

.content {
  @apply bg-snow-50 rounded-xl p-8 shadow-card;
}

.content h3 {
  @apply text-ice-600 text-3xl font-bold m-0 mb-4 text-center;
}

.content p {
  @apply text-mountain-700 text-lg leading-relaxed text-center m-0 mb-8;
}

.version {
  @apply text-center p-4 bg-ice-100/50 rounded-lg mb-8;
}

.version strong {
  @apply text-ice-600;
}

.credits {
  @apply text-center pt-8 border-t border-snow-200;
}

.credits p {
  @apply m-0 text-sm text-mountain-700/70;
}
</style>