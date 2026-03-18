<template>
  <div class="flex h-dvh min-h-screen flex-col bg-snow-100 dark:bg-mountain-900">
    <!-- Burger Menu -->
    <NavigationBurgerMenu :is-open="isMenuOpen" @close="isMenuOpen = false" />

    <!-- Contenu principal -->
    <main class="min-h-0 flex-1 overflow-y-auto pt-4 pb-[calc(7.5rem+env(safe-area-inset-bottom))]">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <NavigationBottomNav @open-menu="isMenuOpen = true" />
  </div>
</template>

<script setup lang="ts">
const isMenuOpen = ref(false);
</script>
