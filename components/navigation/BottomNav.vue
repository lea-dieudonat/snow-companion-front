<template>
  <nav class="fixed bottom-0 left-0 right-0 z-100 flex justify-around items-center bg-snow-50 dark:bg-mountain-950 shadow-[0_-2px_10px_rgba(0_0_0/0.1)] py-3 border-t border-snow-200 dark:border-mountain-700 md:max-w-125 md:mx-auto md:left-1/2 md:-translate-x-1/2 md:rounded-t-3xl">
    <NuxtLink to="/tracking" class="group flex flex-col items-center gap-1 px-4 py-2 no-underline text-mountain-700 dark:text-mountain-300 transition-all rounded-xl min-w-17.5 hover:text-ice-600 hover:bg-ice-100/50 dark:hover:text-ice-400 dark:hover:bg-ice-900/30" active-class="!text-ice-600 dark:!text-ice-400 !font-semibold">
      <UIcon name="i-lucide-bar-chart-3" class="text-2xl transition-transform group-hover:scale-110" />
      <span class="text-xs font-medium">Tracking</span>
    </NuxtLink>

    <NuxtLink to="/sessions/add-session" class="relative flex flex-col items-center gap-1 px-4 py-2 no-underline text-mountain-700 dark:text-mountain-300 transition-all rounded-xl min-w-17.5 hover:text-ice-600 hover:bg-ice-100/50 dark:hover:text-ice-400 dark:hover:bg-ice-900/30" active-class="!text-ice-600 dark:!text-ice-400 !font-semibold">
      <div class="bg-linear-to-br from-ice-400 to-ice-600 text-snow-50 w-14 h-14 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 hover:-translate-y-0.5 hover:shadow-xl">
        <UIcon name="i-lucide-plus" class="text-3xl" />
      </div>
      <span class="text-xs font-medium mt-2">Add</span>
    </NuxtLink>

    <NuxtLink to="/trips" class="group flex flex-col items-center gap-1 px-4 py-2 no-underline text-mountain-700 dark:text-mountain-300 transition-all rounded-xl min-w-17.5 hover:text-ice-600 hover:bg-ice-100/50 dark:hover:text-ice-400 dark:hover:bg-ice-900/30" active-class="!text-ice-600 dark:!text-ice-400 !font-semibold">
      <UIcon name="i-lucide-map" class="text-2xl transition-transform group-hover:scale-110" />
      <span class="text-xs font-medium">Trips</span>
    </NuxtLink>
  </nav>
</template>
