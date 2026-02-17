<template>
  <UCard class="h-full">
    <!-- Header: station left, date right -->
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-bold text-mountain-950 dark:text-snow-50 flex items-center gap-2">
          <UIcon name="i-lucide-mountain" class="text-ice-500 dark:text-ice-400" />
          {{ session.station }}
        </h3>
        <p class="text-sm text-mountain-500 dark:text-mountain-300 flex items-center gap-1">
          <UIcon name="i-lucide-calendar" class="text-base" />
          {{ formatDate(session.date) }}
        </p>
      </div>
    </template>

    <!-- Body: all info -->
    <div class="space-y-3">
      <!-- Rating -->
      <div v-if="session.rating" class="flex items-center gap-1">
        <UIcon name="i-lucide-star" class="text-powder-500 dark:text-powder-400" />
        <span class="text-sm font-bold text-powder-700 dark:text-powder-300">{{ session.rating }}/5</span>
      </div>

      <!-- Conditions -->
      <div v-if="session.conditions" class="flex flex-wrap gap-1.5">
        <UBadge color="primary" variant="soft" size="lg">
          {{ formatCondition(session.conditions) }}
        </UBadge>
      </div>

      <!-- Tricks -->
      <div v-if="session.tricks?.length" class="flex flex-wrap gap-1.5">
        <UBadge v-for="trick in session.tricks" :key="trick" color="warning" variant="subtle">
          <UIcon name="i-lucide-sparkles" class="mr-1" />
          {{ trick }}
        </UBadge>
      </div>

      <!-- Notes -->
      <p v-if="session.notes" class="text-sm text-mountain-600 dark:text-mountain-300 leading-relaxed bg-mountain-100/50 dark:bg-mountain-700/30 rounded-lg px-3 py-2">
        {{ session.notes }}
      </p>
    </div>

    <!-- Footer: buttons -->
    <template #footer>
      <div class="flex gap-2 w-full">
        <UButton color="primary" variant="soft" icon="i-lucide-pencil" size="md" block @click="$emit('edit', session)">
          Modifier
        </UButton>
        <UButton color="error" variant="soft" icon="i-lucide-trash-2" size="md" block @click="$emit('delete', session.id)">
          Supprimer
        </UButton>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { Session } from '~/types/session.types'
import { CONDITIONS } from '~/constants/conditions'

defineProps<{
  session: Session
}>()

defineEmits<{
  edit: [session: Session]
  delete: [id: string]
}>()

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatCondition = (key: string) => {
  const condition = CONDITIONS[key as keyof typeof CONDITIONS]
  return condition ? `${condition.emoji} ${condition.label}` : key
}
</script>