<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div v-if="isOpen" class="menu-overlay" @click="emit('close')"></div>
  </Transition>

  <!-- Menu Panel -->
  <Transition name="slide">
    <div v-if="isOpen" class="menu-panel">
      <div class="menu-header">
        <h2>Menu</h2>
        <button class="close-btn" @click="emit('close')">✕</button>
      </div>

      <nav class="menu-nav">
        <NuxtLink to="/profile" class="menu-item" @click="emit('close')">
          <span class="menu-icon">👤</span>
          <span>Profil</span>
        </NuxtLink>

        <NuxtLink to="/settings" class="menu-item" @click="emit('close')">
          <span class="menu-icon">⚙️</span>
          <span>Paramètres</span>
        </NuxtLink>

        <NuxtLink to="/about" class="menu-item" @click="emit('close')">
          <span class="menu-icon">ℹ️</span>
          <span>À propos</span>
        </NuxtLink>

        <div class="menu-divider"></div>

        <a href="#" class="menu-item menu-item-danger" @click.prevent="handleLogout">
          <span class="menu-icon">🚪</span>
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
@reference "~/assets/css/main.css";
/* Overlay */
.menu-overlay {
  @apply fixed inset-0 bg-mountain-900/50 z-[200];
}

/* Menu Panel */
.menu-panel {
  @apply fixed top-0 right-0 bottom-0 w-[280px] max-w-[85vw] bg-snow-50 z-[300] shadow-[-2px_0_10px_rgba(0,0,0,0.1)] overflow-y-auto;
}

.menu-header {
  @apply flex justify-between items-center p-6 border-b border-snow-200 bg-gradient-to-br from-ice-400 to-ice-600 text-snow-50;
}

.menu-header h2 {
  @apply m-0 text-2xl;
}

.close-btn {
  @apply bg-transparent border-none text-2xl cursor-pointer text-snow-50 p-2 transition-transform hover:scale-110;
}

/* Navigation */
.menu-nav {
  @apply py-4;
}

.menu-item {
  @apply flex items-center gap-4 px-6 py-4 no-underline text-mountain-800 transition-colors text-base font-medium hover:bg-ice-100/50;
}

.menu-icon {
  @apply text-2xl w-8 text-center;
}

.menu-divider {
  @apply h-px bg-snow-200 my-4;
}

.menu-item-danger {
  @apply text-powder-500 hover:bg-powder-100/50;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  @apply transition-opacity duration-300;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}

.slide-enter-active,
.slide-leave-active {
  @apply transition-transform duration-300;
}

.slide-enter-from,
.slide-leave-to {
  @apply translate-x-full;
}
</style>