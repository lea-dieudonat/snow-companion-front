<template>
  <UCard>
    <div class="space-y-4">
      <!-- Header: station + date + rating -->
      <div class="flex items-start justify-between">
        <div>
          <h3 class="text-xl font-bold text-mountain-950 dark:text-snow-50 flex items-center gap-2">
            <UIcon name="i-lucide-mountain" class="text-ice-500 dark:text-ice-400" />
            {{ session.station }}
          </h3>
          <p class="text-sm text-mountain-500 dark:text-mountain-300 mt-1 flex items-center gap-1">
            <UIcon name="i-lucide-calendar" class="text-base" />
            {{ formatDate(session.date) }}
          </p>
        </div>
        <div v-if="session.rating" class="flex items-center gap-1 bg-powder-50 dark:bg-powder-900/30 text-powder-700 dark:text-powder-300 px-2.5 py-1 rounded-lg">
          <UIcon name="i-lucide-star" class="text-powder-500 dark:text-powder-400" />
          <span class="text-sm font-bold">{{ session.rating }}/5</span>
        </div>
      </div>

      <!-- Conditions + Tricks -->
      <div v-if="session.conditions || session.tricks?.length" class="flex flex-wrap gap-1.5">
        <UBadge v-if="session.conditions" color="primary" variant="soft" size="lg">
          {{ formatCondition(session.conditions) }}
        </UBadge>
        <UBadge v-for="trick in session.tricks" :key="trick" color="warning" variant="subtle">
          <UIcon name="i-lucide-sparkles" class="mr-1" />
          {{ trick }}
        </UBadge>
      </div>

      <!-- Notes -->
      <p v-if="session.notes" class="text-sm text-mountain-600 dark:text-mountain-300 leading-relaxed bg-mountain-100/50 dark:bg-mountain-700/30 rounded-lg px-3 py-2">
        {{ session.notes }}
      </p>

      <!-- Actions -->
      <div class="flex gap-2">
        <UButton color="primary" variant="soft" icon="i-lucide-pencil" size="sm" @click="$emit('edit', session)">
          Modifier
        </UButton>
        <UButton color="error" variant="soft" icon="i-lucide-trash-2" size="sm" @click="$emit('delete', session.id)">
          Supprimer
        </UButton>
      </div>
    </div>
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