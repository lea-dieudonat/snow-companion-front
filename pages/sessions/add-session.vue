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
  <div class="page-container-narrow">
    <AppPageHeader title="Nouvelle Session" description="Log ton ride du jour !" icon="i-lucide-plus-circle" />

    <SessionsForm @sessionCreated="handleSessionCreated" />
  </div>
</template>
