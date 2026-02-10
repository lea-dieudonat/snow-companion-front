<template>
  <form @submit.prevent="handleSubmit" class="bg-snow-50 rounded-lg shadow-card p-6 space-y-6">
    <h2 class="text-2xl font-bold text-mountain-900 mb-6">
      ➕ New Session
    </h2>
    
    <!-- Station -->
    <div>
      <label class="block text-sm font-medium text-mountain-800 mb-2">
        Station *
      </label>
      <input
        v-model="formData.station"
        type="text"
        required
        placeholder="Ex: Les 3 Vallées"
        class="w-full px-4 py-3 rounded-lg border-2 border-snow-300 focus:border-ice-500 focus:ring-2 focus:ring-ice-500/20 outline-none transition-all"
      />
    </div>
    
    <!-- Date -->
    <div>
      <label class="block text-sm font-medium text-mountain-800 mb-2">
        Date *
      </label>
      <input
        v-model="formData.date"
        type="date"
        required
        class="w-full px-4 py-3 rounded-lg border-2 border-snow-300 focus:border-ice-500 focus:ring-2 focus:ring-ice-500/20 outline-none transition-all"
      />
    </div>
    
    <!-- Rating -->
    <div>
      <label class="block text-sm font-medium text-mountain-800 mb-2">
        Rating (1-5)
      </label>
      <input
        v-model.number="formData.rating"
        type="number"
        min="1"
        max="5"
        placeholder="3"
        class="w-full px-4 py-3 rounded-lg border-2 border-snow-300 focus:border-ice-500 focus:ring-2 focus:ring-ice-500/20 outline-none transition-all"
      />
    </div>
    
    <!-- Comments -->
    <div>
      <label class="block text-sm font-medium text-mountain-800 mb-2">
        Notes
      </label>
      <textarea
        v-model="formData.notes"
        rows="4"
        placeholder="How was the snow? Any new tricks?"
        class="w-full px-4 py-3 rounded-lg border-2 border-snow-300 focus:border-ice-500 focus:ring-2 focus:ring-ice-500/20 outline-none transition-all resize-none"
      ></textarea>
    </div>
    
    <!-- Actions -->
    <div class="flex gap-3 pt-4">
      <button
        type="submit"
        class="w-full px-6 py-3 bg-ice-500 hover:bg-ice-600 text-snow-50 rounded-lg transition-colors duration-200 font-medium shadow-lg"
      >
        Create Session
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { CreateSessionInput } from '../../types/session.types';
import { useSessions } from '../../composables/useSessions';
import { ref } from 'vue';

const emit = defineEmits<{
  sessionCreated: []
}>();

const { createSession } = useSessions();

const formData = ref<CreateSessionInput>({
  date: new Date().toISOString().split('T')[0] as string,
  station: '',
  conditions: '',
  tricks: [],
  notes: '',
  photos: [],
  rating: undefined,
  userId: 'cmlew0i3z000014oao6mkmk7m', // TODO: remplacer par vrai user une fois l'auth en place
});

const tricksInput = ref('');
const loading = ref(false);
const error = ref('');
const success = ref(false);

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = '';
    success.value = false;

    emit('sessionCreated');

    // Parse les tricks
    const tricks = tricksInput.value
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);

    await createSession({
      ...formData.value,
      tricks,
      date: new Date(formData.value.date).toISOString(),
    });

    success.value = true;
    
    // Reset le form
    formData.value = {
      date: new Date().toISOString().split('T')[0] as string,
      station: '',
      conditions: '',
      tricks: [],
      notes: '',
      photos: [],
      rating: undefined,
      userId: 'cmlew0i3z000014oao6mkmk7m',
    };
    tricksInput.value = '';

  } catch (e: any) {
    error.value = e.message || 'Une erreur est survenue';
  } finally {
    loading.value = false;
  }
};
</script>