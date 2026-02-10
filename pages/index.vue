<script setup lang="ts">
const sessionListRef = ref();

// Callback pour rafraîchir la liste des sessions après création
const handleSessionCreated = () => {
  sessionListRef.value?.fetchSessions();
};
</script>

<template>
  <div class="space-y-8">
    <!-- Formulaire de création -->
    <SessionsSessionForm @sessionCreated="handleSessionCreated" />
    
    <!-- Liste des sessions -->
    <SessionsSessionList ref="sessionListRef" />
  </div>
</template>