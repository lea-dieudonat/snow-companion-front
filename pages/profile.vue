<script setup lang="ts">
definePageMeta({
  layout: 'default'
});
</script>

<template>
  <div class="profile-page">
    <div class="page-header">
      <h2>👤 Profil</h2>
    </div>
    
    <div class="placeholder">
      <p>Page profil à venir...</p>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  @apply p-4 max-w-4xl mx-auto;
}

.page-header h2 {
  @apply text-snow-50 text-3xl font-bold m-0 mb-8 drop-shadow-lg text-center;
}

.placeholder {
  @apply bg-snow-50 rounded-xl p-12 text-center shadow-card;
}

.placeholder p {
  @apply text-mountain-700 text-lg m-0;
}
</style>