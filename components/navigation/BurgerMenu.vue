<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 bg-mountain-900/50 z-200" @click="emit('close')"></div>
  </Transition>

  <!-- Menu Panel -->
  <Transition name="slide">
    <div v-if="isOpen" class="fixed top-0 right-0 bottom-0 w-70 max-w-[85vw] bg-snow-50 dark:bg-mountain-900 z-300 shadow-[-2px_0_10px_rgba(0_0_0/0.1)] overflow-y-auto">
      <div class="flex justify-between items-center p-6 border-b border-snow-200 dark:border-mountain-700 bg-linear-to-br from-ice-400 to-ice-600 text-snow-50">
        <h2 class="m-0 text-2xl">Menu</h2>
        <UButton icon="i-lucide-x" variant="ghost" size="xl" @click="emit('close')"
          aria-label="Fermer le menu" />
      </div>

      <nav class="py-4">
        <NuxtLink to="/profile" class="flex items-center gap-4 px-6 py-4 no-underline text-mountain-800 dark:text-mountain-200 transition-colors text-base font-medium hover:bg-ice-100/50 dark:hover:bg-ice-900/30" @click="emit('close')">
          <UIcon name="i-lucide-user" class="text-2xl w-8 text-center" />
          <span>Profil</span>
        </NuxtLink>

        <NuxtLink to="/settings" class="flex items-center gap-4 px-6 py-4 no-underline text-mountain-800 dark:text-mountain-200 transition-colors text-base font-medium hover:bg-ice-100/50 dark:hover:bg-ice-900/30" @click="emit('close')">
          <UIcon name="i-lucide-settings" class="text-2xl w-8 text-center" />
          <span>Paramètres</span>
        </NuxtLink>

        <NuxtLink to="/about" class="flex items-center gap-4 px-6 py-4 no-underline text-mountain-800 dark:text-mountain-200 transition-colors text-base font-medium hover:bg-ice-100/50 dark:hover:bg-ice-900/30" @click="emit('close')">
          <UIcon name="i-lucide-info" class="text-2xl w-8 text-center" />
          <span>À propos</span>
        </NuxtLink>

        <UDivider class="my-4" />

        <a href="#" class="flex items-center gap-4 px-6 py-4 no-underline text-powder-500 transition-colors text-base font-medium hover:bg-powder-100/50" @click.prevent="handleLogout">
          <UIcon name="i-lucide-log-out" class="text-2xl w-8 text-center" />
          <span>Déconnexion</span>
        </a>
      </nav>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const handleLogout = () => {
  // TODO: Implémenter la déconnexion
  console.log('Déconnexion');
  emit('close');
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
