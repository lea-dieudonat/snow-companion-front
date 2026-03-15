<script setup lang="ts">
const userStore = useUserStore();
await useAsyncData('auth-init', () => userStore.fetchMe());
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>