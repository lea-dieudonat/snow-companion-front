<template>
  <nav class="bottom-nav">
    <NuxtLink to="/tracking" class="nav-item" active-class="nav-item-active">
      <span class="nav-icon">📊</span>
      <span class="nav-label">Tracking</span>
    </NuxtLink>
    
    <NuxtLink to="/add-session" class="nav-item nav-item-add" active-class="nav-item-active">
      <span class="nav-icon-add">➕</span>
      <span class="nav-label">Add</span>
    </NuxtLink>
    
    <NuxtLink to="/trips" class="nav-item" active-class="nav-item-active">
      <span class="nav-icon">🗺️</span>
      <span class="nav-label">Trips</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  @apply fixed bottom-0 left-0 right-0 z-[100] flex justify-around items-center bg-snow-50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] py-3 border-t border-snow-200;
}

.nav-item {
  @apply flex flex-col items-center gap-1 px-4 py-2 no-underline text-mountain-700 transition-all rounded-xl min-w-[70px] hover:text-ice-600 hover:bg-ice-100/50;
}

.nav-item-active {
  @apply text-ice-600 font-semibold;
}

.nav-icon {
  @apply text-2xl transition-transform;
}

.nav-item:hover .nav-icon {
  @apply scale-110;
}

.nav-label {
  @apply text-xs font-medium;
}

/* Bouton Add - style spécial */
.nav-item-add {
  @apply relative;
}

.nav-icon-add {
  @apply text-3xl bg-gradient-to-br from-ice-400 to-ice-600 text-snow-50 w-14 h-14 flex items-center justify-center rounded-full shadow-lg transition-all;
}

.nav-item-add:hover .nav-icon-add {
  @apply scale-105 -translate-y-0.5 shadow-xl;
}

.nav-item-add .nav-label {
  @apply mt-2;
}

/* Responsive Desktop */
@media (min-width: 768px) {
  .bottom-nav {
    @apply max-w-[500px] mx-auto left-1/2 -translate-x-1/2 rounded-t-3xl;
  }
}
</style>