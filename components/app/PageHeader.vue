<script setup lang="ts">
const props = defineProps<{
    title: string;
    description?: string;
    icon?: string;
}>();
</script>
<template>
    <div class="mb-8 text-center">
        <UIcon :name="icon || 'i-lucide-map'" class="text-5xl text-ice-500 mx-auto mb-4" />
        <h2 class="text-mountain-900 dark:text-snow-50 text-3xl md:text-4xl font-bold m-0 mb-2">{{ title }}</h2>
        <p class="text-mountain-500 dark:text-mountain-300 text-base m-0">{{ description }}</p>
    </div>
</template>