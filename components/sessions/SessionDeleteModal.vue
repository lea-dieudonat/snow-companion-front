<template>
  <UModal v-model="isModalOpen">
    <UCard>
      <template #header>
        <div class="flex items-center gap-3">
          <UIcon name="i-lucide-alert-triangle" class="text-4xl text-error-500" />
          <h2 class="text-xl font-bold text-mountain-900">Confirmer la suppression</h2>
        </div>
      </template>

      <p class="text-mountain-700">
        Es-tu sûr(e) de vouloir supprimer cette session ? Cette action est irréversible.
      </p>

      <template #footer>
        <div class="flex gap-3">
          <UButton color="neutral" variant="outline" block @click="handleCancel">
            Annuler
          </UButton>
          <UButton color="error" icon="i-lucide-trash-2" block @click="handleConfirm">
            Supprimer
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()

const isModalOpen = computed({
  get: () => props.isOpen,
  set: (value) => { if (!value) emit('cancel') }
})

const handleCancel = () => emit('cancel')
const handleConfirm = () => emit('confirm')
</script>