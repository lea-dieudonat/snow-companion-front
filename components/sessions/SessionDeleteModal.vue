<template>
  <div 
    v-if="isOpen"
    @click="$emit('cancel')"
    class="fixed inset-0 bg-mountain-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
  >
    <div 
      @click.stop
      class="bg-snow-50 rounded-xl shadow-2xl max-w-md w-full animate-slideUp"
    >
      <!-- Header avec icône warning -->
      <div class="bg-powder-400 px-6 py-4 rounded-t-xl flex items-center gap-3">
        <div class="text-4xl">⚠️</div>
        <h2 class="text-xl font-bold text-snow-50">Confirm Deletion</h2>
      </div>
      
      <!-- Content -->
      <div class="p-6">
        <p class="text-mountain-700 mb-6">
          Are you sure you want to delete this session? This action cannot be undone.
        </p>
        
        <!-- Actions -->
        <div class="flex gap-3">
          <button
            @click="$emit('cancel')"
            class="flex-1 px-6 py-3 bg-mountain-700 hover:bg-mountain-800 text-snow-50 rounded-lg transition-colors duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            @click="$emit('confirm')"
            class="flex-1 px-6 py-3 bg-powder-400 hover:bg-powder-500 text-snow-50 rounded-lg transition-colors duration-200 font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  cancel: []
  confirm: []
}>()
</script>
