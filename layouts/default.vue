<template>
  <div class="flex flex-col min-h-screen bg-snow-100 dark:bg-mountain-900">
    <!-- Header avec burger menu -->
    <header class="sticky top-0 z-100 bg-snow-50/95 dark:bg-mountain-950/95 backdrop-blur-md shadow-md">
      <div class="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <h1 class="text-2xl md:text-3xl font-bold text-ice-600 dark:text-ice-400 m-0">🏂 Snow Companion</h1>
        <div class="flex items-center gap-1">
          <UButton
            :icon="colorMode.preference === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
            variant="ghost"
            color="primary"
            size="xl"
            aria-label="Toggle theme"
            @click="colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'"
          />
          <UButton icon="i-lucide-menu" variant="ghost" color="primary" size="xl" aria-label="Menu" @click="toggleMenu" />
        </div>
      </div>
    </header>

    <!-- Burger Menu -->
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
const colorMode = useColorMode();
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>