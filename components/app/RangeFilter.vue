<script setup lang="ts">
defineProps<{
    icon: string;
    label: string;
    modelValue: number;
    min: number;
    max: number;
    step: number;
    valueSuffix: string;
    minLabel: string;
    maxLabel: string;
}>();

const emit = defineEmits<{
    'update:modelValue': [value: number];
}>();
</script>

<template>
    <UFormField>
        <template #label>
            <div class="flex items-center justify-between w-full">
                <div class="filter-label">
                    <UIcon :name="icon" class="text-ice-500" />
                    {{ label + ' ' }}
                </div>
                <span class="text-sm font-semibold text-ice-500">{{ modelValue }}{{ valueSuffix }}</span>
            </div>
        </template>
        <input :value="modelValue" type="range" :min="min" :max="max" :step="step" class="range-input"
            @input="emit('update:modelValue', Number(($event.target as HTMLInputElement).value))" />
        <div class="range-label">
            <span>{{ minLabel }}</span>
            <span>{{ maxLabel }}</span>
        </div>
    </UFormField>
</template>
