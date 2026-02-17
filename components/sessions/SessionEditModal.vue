<template>
  <!-- Overlay (fond sombre) -->
  <div 
    v-if="isOpen"
    @click="handleBackdropClick"
    class="fixed inset-0 bg-mountain-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
  >
    <!-- Modal -->
    <div 
      @click.stop
      class="bg-snow-50 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
    >
      <!-- Header -->
      <div class="sticky top-0 bg-linear-to-r from-ice-600 to-ice-500 px-6 py-4 flex justify-between items-center rounded-t-xl">
        <h2 class="text-2xl font-bold text-snow-50">✏️ Edit Session</h2>
        <button
          @click="$emit('close')"
          class="text-snow-50 hover:text-snow-200 transition-colors p-2 hover:bg-ice-700/30 rounded-lg"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Content -->
      <div class="p-6">
        <SessionsSessionForm
          :session="session"
          :is-editing="true"
          @submit="handleSubmit"
          @cancel="$emit('close')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Session } from '~/types/session.types'

defineProps<{
  isOpen: boolean
  session: Session | null
}>()

const emit = defineEmits<{
  close: []
  submit: [session: Session]
}>()

const handleBackdropClick = () => {
  emit('close')
}

const handleSubmit = (session: Session) => {
  emit('submit', session)
}
</script>
