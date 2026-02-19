<template>
  <UModal :open="isOpen" @update:open="val => { if (!val) handleCancel() }">
    <template #header>
      <div class="flex items-center gap-3">
        <UIcon name="i-lucide-alert-triangle" class="text-4xl text-error-500" />
        <h2 class="text-xl font-bold text-mountain-900 dark:text-snow-50">Confirmer la suppression</h2>
      </div>
    </template>

    <template #body>
      <p class="text-mountain-700 dark:text-mountain-300">
        Es-tu sûr(e) de vouloir supprimer cette session ? Cette action est irréversible.
      </p>
    </template>

    <template #footer>
      <div class="flex gap-3 w-full">
        <UButton color="neutral" variant="outline" block @click="handleCancel">
          Annuler
        </UButton>
        <UButton color="error" icon="i-lucide-trash-2" block @click="handleConfirm">
          Supprimer
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()

const handleCancel = () => emit('cancel')
const handleConfirm = () => emit('confirm')
</script>
