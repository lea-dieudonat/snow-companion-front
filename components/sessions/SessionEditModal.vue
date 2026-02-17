<template>
  <UModal :open="isOpen" @update:open="val => { if (!val) handleClose() }">
    <template #header>
      <div class="flex justify-between items-center w-full">
        <h2 class="text-2xl font-bold text-mountain-900 dark:text-snow-50 flex items-center gap-2">
          <UIcon name="i-lucide-pencil" />
          Modifier la session
        </h2>
        <UButton icon="i-lucide-x" color="neutral" variant="ghost" @click="handleClose" />
      </div>
    </template>

    <template #body>
      <SessionsSessionForm :session="session" :is-editing="true" @submit="handleSubmit" @cancel="handleClose" />
    </template>
  </UModal>
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

const handleClose = () => emit('close')
const handleSubmit = (session: Session) => emit('submit', session)
</script>
