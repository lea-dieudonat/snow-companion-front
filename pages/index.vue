<script setup lang="ts">
definePageMeta({ layout: 'default' });
const router = useRouter();
onMounted(() => router.push('/trips'));
</script>

<template>
  <div class="flex items-center justify-center min-h-[50vh]">
    <AppLoader size="lg" label="Chargement..." />
  </div>
</template>