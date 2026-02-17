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
  <div class="flex items-center justify-center min-h-[50vh]">
    <div class="text-center">
      <div class="w-12 h-12 mx-auto mb-4 border-4 border-snow-100/30 border-t-snow-50 rounded-full animate-spin"></div>
      <p class="text-snow-50 text-xl">Chargement...</p>
    </div>
  </div>
</template>
