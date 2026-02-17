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
  <div class="p-4 md:p-8 max-w-2xl mx-auto">
    <div class="mb-8 text-center">
      <h2 class="text-snow-50 text-3xl md:text-4xl font-bold m-0 mb-2 drop-shadow-lg">➕ Nouvelle Session</h2>
      <p class="text-snow-100 text-base m-0">Log ton ride du jour !</p>
    </div>

    <SessionsSessionForm @sessionCreated="handleSessionCreated" />
  </div>
</template>
