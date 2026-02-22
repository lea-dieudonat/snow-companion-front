<script setup lang="ts">
defineProps<{
    label: string;
    description: string;
    icon?: string;
    dashed?: boolean;
}>();
</script>

<template>
    <div class="rounded-2xl p-10 text-center"
        :class="dashed ? 'border-2 border-dashed border-mountain-200 dark:border-mountain-700' : ''">
        <UIcon v-if="icon" :name="icon" class="text-4xl text-mountain-300 mx-auto mb-3" />
        <p class="text-mountain-500 dark:text-mountain-400 font-medium">{{ label }}</p>
        <p class="text-mountain-400 dark:text-mountain-500 text-sm mt-1">
            {{ description }}
        </p>
        <slot />
    </div>
</template>