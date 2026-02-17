<script setup lang="ts">
definePageMeta({ layout: 'default' });
</script>

<template>
  <div class="p-4 max-w-4xl mx-auto">
    <div class="mb-8 text-center">
      <UIcon name="i-lucide-info" class="text-5xl text-ice-500 mx-auto mb-4" />
      <h2 class="text-mountain-900 dark:text-snow-50 text-3xl font-bold m-0">À propos</h2>
    </div>

    <UCard>
      <template #header>
        <h3 class="text-3xl font-bold text-center flex items-center justify-center gap-2">
          <UIcon name="i-lucide-mountain-snow" class="text-ice-600" />
          Snow Companion
        </h3>
      </template>

      <div class="space-y-6">
        <p class="text-mountain-700 text-lg leading-relaxed text-center">
          Ton compagnon ultime pour tracker tes sessions de snowboard et ski,
          et planifier tes prochaines aventures en montagne ! ⛰️
        </p>

        <UDivider />

        <div class="text-center">
          <UBadge color="primary" variant="soft" size="lg">
            <UIcon name="i-lucide-tag" class="mr-1" />
            Version 1.0.0-beta
          </UBadge>
        </div>

        <UDivider />

        <p class="text-sm text-mountain-700/70 text-center flex items-center justify-center gap-2">
          <UIcon name="i-lucide-heart" class="text-error-500" />
          Développé avec passion pour les riders
        </p>
      </div>
    </UCard>
  </div>
</template>