<template>
  <div class="bg-snow-50 rounded-lg shadow-card hover:shadow-card-hover transition-shadow duration-300 overflow-hidden">
    <!-- Header avec la station -->
    <div class="bg-gradient-to-r from-ice-600 to-ice-500 px-6 py-4">
      <h3 class="text-xl font-bold text-snow-50">{{ session.station }}</h3>
      <p class="text-ice-100 text-sm">{{ formatDate(session.date) }}</p>
    </div>
    
    <!-- Contenu -->
    <div class="p-6">
      <!-- Note -->
      <div v-if="session.rating" class="flex items-center gap-2 mb-4">
        <span class="text-2xl">⭐</span>
        <span class="text-lg font-semibold text-mountain-800">{{ session.rating }}/5</span>
      </div>
      
      <!-- Commentaires -->
      <p v-if="session.notes" class="text-mountain-700 mb-4 leading-relaxed">
        {{ session.notes }}
      </p>
      
      <!-- Actions -->
      <div class="flex gap-3 pt-4 border-t border-snow-300">
        <button
          @click="$emit('edit', session)"
          class="flex-1 px-4 py-2 bg-ice-500 hover:bg-ice-600 text-snow-50 rounded-lg transition-colors duration-200 font-medium"
        >
          ✏️ Edit
        </button>
        <button
          @click="$emit('delete', session.id)"
          class="flex-1 px-4 py-2 bg-powder-400 hover:bg-powder-500 text-snow-50 rounded-lg transition-colors duration-200 font-medium"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Session } from '~/types/session.types'

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
</script>