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
    <AppPageHeader title="Nouvelle Session" description="Log ton ride du jour !" icon="i-lucide-plus-circle" />

    <SessionsForm @sessionCreated="handleSessionCreated" />
  </div>
</template>
