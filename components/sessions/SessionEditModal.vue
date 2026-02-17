<template>
  <UModal v-model="isModalOpen">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-mountain-900 flex items-center gap-2">
            <UIcon name="i-lucide-pencil" />
            Modifier la session
          </h2>
          <UButton icon="i-lucide-x" color="neutral" variant="ghost" @click="handleClose" />
        </div>
      </template>

      <SessionsSessionForm :session="session" :is-editing="true" @submit="handleSubmit" @cancel="handleClose" />
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import type { Session } from '~/types/session.types'

const props = defineProps<{
  isOpen: boolean
  session: Session | null
}>()

const emit = defineEmits<{
  close: []
  submit: [session: Session]
}>()

const isModalOpen = computed({
  get: () => props.isOpen,
  set: (value) => { if (!value) emit('close') }
})

const handleClose = () => emit('close')
const handleSubmit = (session: Session) => emit('submit', session)
</script>