<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'auth' });
</script>

<template>
  <div class="page-container-sm">
    <AppPageHeader title="Paramètres" icon="i-lucide-settings" />

    <UCard>
      <template #header>
        <h2 class="heading-card">
          <UIcon name="i-lucide-user-circle" class="text-ice-500" />
          Profil rider
        </h2>
      </template>

      <p class="text-sm text-muted mb-4">
        Renseigne ton niveau et tes préférences pour que l'agent personnalise ses recommandations.
      </p>

      <UButton to="/profile" color="primary" variant="soft" icon="i-lucide-arrow-right">
        Gérer mon profil rider
      </UButton>
    </UCard>
  </div>
</template>
