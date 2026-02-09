<script setup lang="ts">
  const sessionListRef = ref();

  // Callback pour rafraîchir la liste des sessions après création
  const handleSessionCreated = () => {
    sessionListRef.value?.fetchSessions();
  };
</script>

<template>
  <div class="container">
    <h1>🏔️ Snow Companion</h1>
    <SessionsSessionForm @sessionCreated="handleSessionCreated" />
    <SessionsSessionList ref="sessionListRef" />
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

h1 {
  text-align: center;
  color: white;
  font-size: 3rem;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}
</style>