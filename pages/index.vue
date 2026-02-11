<script setup lang="ts">
const handleSessionCreated = () => {
  refreshNuxtData('sessions');
};
</script>

<template>
  <div class="space-y-8">
    <!-- Formulaire de création -->
    <SessionsSessionForm @sessionCreated="handleSessionCreated" />

    <!-- Liste des sessions -->
    <SessionsSessionList />
  </div>
</template>
