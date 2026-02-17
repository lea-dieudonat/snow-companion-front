<template>
  <UCard>
    <template #header>
      <div class="bg-linear-to-r from-ice-600 to-ice-500 -mx-6 -mt-6 px-6 py-4 rounded-t-lg">
        <h3 class="text-xl font-bold text-snow-50 flex items-center gap-2">
          <UIcon name="i-lucide-mountain" />
          {{ session.station }}
        </h3>
        <p class="text-ice-100 text-sm flex items-center gap-1 mt-1">
          <UIcon name="i-lucide-calendar" class="text-base" />
          {{ formatDate(session.date) }}
        </p>
      </div>
    </template>

    <div class="space-y-4">
      <!-- Note -->
      <div v-if="session.rating" class="flex items-center gap-2">
        <UIcon name="i-lucide-star" class="text-powder-400 text-xl" />
        <span class="text-lg font-semibold text-mountain-800">{{ session.rating }}/5</span>
      </div>

      <!-- Conditions -->
      <div v-if="session.conditions">
        <UBadge color="primary" variant="soft" size="lg">
          {{ formatCondition(session.conditions) }}
        </UBadge>
      </div>

      <!-- Tricks -->
      <div v-if="session.tricks?.length" class="flex flex-wrap gap-2">
        <UBadge v-for="trick in session.tricks" :key="trick" color="neutral" variant="soft">
          <UIcon name="i-lucide-sparkles" class="mr-1" />
          {{ trick }}
        </UBadge>
      </div>

      <!-- Notes -->
      <p v-if="session.notes" class="text-mountain-700 leading-relaxed flex gap-2">
        <UIcon name="i-lucide-message-square" class="text-mountain-500 flex-shrink-0 mt-1" />
        <span>{{ session.notes }}</span>
      </p>
    </div>

    <template #footer>
      <div class="flex gap-3 -mx-6 -mb-6 px-6 py-4 bg-snow-100/50 rounded-b-lg">
        <UButton color="primary" variant="soft" icon="i-lucide-pencil" block @click="$emit('edit', session)">
          Modifier
        </UButton>
        <UButton color="error" variant="soft" icon="i-lucide-trash-2" block @click="$emit('delete', session.id)">
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