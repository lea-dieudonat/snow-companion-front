<script setup lang="ts">
definePageMeta({ layout: 'default' });
const router = useRouter();
onMounted(() => router.push('/trips'));
</script>

<template>
  <div class="flex items-center justify-center min-h-[50vh]">
    <div class="text-center">
      <UIcon name="i-lucide-loader-2" class="text-6xl text-ice-400 animate-spin mx-auto mb-4" />
      <p class="text-mountain-500 text-xl">Chargement...</p>
    </div>
  </div>
</template>