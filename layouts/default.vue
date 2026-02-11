<template>
  <div class="app-layout">
    <!-- Header avec burger menu -->
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">🏂 Snow Companion</h1>
        <button class="burger-btn" @click="toggleMenu">
          ☰
        </button>
      </div>
    </header>

    <!-- Burger Menu (collapsed by default) -->
    <NavigationBurgerMenu :isOpen="isMenuOpen" @close="toggleMenu" />

    <!-- Contenu principal -->
    <main class="app-main">
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

<style scoped>
.app-layout {
  @apply flex flex-col min-h-screen bg-gradient-to-br from-ice-400 via-ice-500 to-ice-600;
}

/* Header */
.app-header {
  @apply sticky top-0 z-[100] bg-snow-50/95 backdrop-blur-md shadow-md;
}

.header-content {
  @apply flex justify-between items-center px-6 py-4 max-w-7xl mx-auto;
}

.app-title {
  @apply text-2xl md:text-3xl font-bold text-ice-600 m-0;
}

.burger-btn {
  @apply bg-transparent border-none text-3xl cursor-pointer p-2 text-ice-600 transition-transform hover:scale-110;
}

/* Main content */
.app-main {
  @apply flex-1 pb-20 overflow-y-auto;
}
</style>