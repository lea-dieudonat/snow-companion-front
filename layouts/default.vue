<template>
  <div class="flex h-dvh min-h-screen flex-col bg-snow-100 dark:bg-mountain-900">
    <!-- Burger Menu -->
    <NavigationBurgerMenu :is-open="isMenuOpen" @close="isMenuOpen = false" />

    <!-- Planner Modal (toujours monté pour préserver l'état de la conversation) -->
    <PlannerModal :is-open="isPlannerOpen" @close="isPlannerOpen = false" />

    <!-- Contenu principal -->
    <main class="min-h-0 flex-1 overflow-y-auto pt-4 pb-[calc(7.5rem+env(safe-area-inset-bottom))]">
      <slot />
    </main>

    <!-- FAB Planner (caché sur la page d'ajout de session) -->
    <Transition name="fab">
      <button
        v-if="route.path !== '/sessions/add-session'"
        class="fixed right-4 z-150 w-14 h-14 flex items-center justify-center rounded-full bg-linear-to-br from-ice-400 to-ice-600 text-snow-50 shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
        :style="{ bottom: 'calc(7.5rem + env(safe-area-inset-bottom) + 0.75rem)' }"
        aria-label="Ouvrir le Planner IA"
        @click="isPlannerOpen = true"
      >
        <UIcon name="i-lucide-sparkles" class="text-2xl" />
      </button>
    </Transition>

    <!-- Bottom Navigation -->
    <NavigationBottomNav @open-menu="isMenuOpen = true" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const isMenuOpen = ref(false);
const isPlannerOpen = ref(false);
</script>

<style scoped>
.fab-enter-active,
.fab-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fab-enter-from,
.fab-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
