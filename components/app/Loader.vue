<!-- components/app/Loader.vue -->
<script setup lang="ts">
defineProps<{
    size?: 'sm' | 'md' | 'lg';
    label?: string;
}>();
</script>

<template>
    <div class="flex flex-col items-center justify-center py-10 gap-3">
        <UIcon name="i-lucide-loader-2" class="animate-spin text-ice-400" :class="{
            'text-2xl': size === 'sm',
            'text-4xl': !size || size === 'md',
            'text-6xl': size === 'lg',
        }" />
        <p v-if="label" class="text-mountain-500 text-lg">{{ label }}</p>
    </div>
</template>