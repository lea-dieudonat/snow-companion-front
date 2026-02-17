<template>
  <div class="flex flex-col min-h-screen bg-linear-to-br from-ice-400 via-ice-500 to-ice-600">
    <!-- Header avec burger menu -->
    <header class="sticky top-0 z-100 bg-snow-50/95 backdrop-blur-md shadow-md">
      <div class="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <h1 class="text-2xl md:text-3xl font-bold text-ice-600 m-0">🏂 Snow Companion</h1>
        <UButton icon="i-lucide-menu" variant="ghost" size="xl" @click="toggleMenu"
          aria-label="Menu" />
      </div>
    </header>

    <!-- Burger Menu (collapsed by default) -->
    <NavigationBurgerMenu :isOpen="isMenuOpen" @close="toggleMenu" />

    <!-- Contenu principal -->
    <main class="flex-1 pb-20 overflow-y-auto">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <NavigationBottomNav />
  </div>
</template>

<script setup lang="ts">
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>
