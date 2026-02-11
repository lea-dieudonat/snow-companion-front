<template>
  <form @submit.prevent="handleSubmit" class="bg-snow-50 rounded-lg shadow-card p-6 space-y-6">
    <h2 v-if="!isEditing" class="text-2xl font-bold text-mountain-900 mb-6">
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
    
    <!-- Conditions -->
    <div>
      <label class="block text-sm font-medium text-mountain-800 mb-2">
        Conditions
      </label>
      <select
        v-model="formData.conditions"
        class="w-full px-4 py-3 rounded-lg border-2 border-snow-300 focus:border-ice-500 focus:ring-2 focus:ring-ice-500/20 outline-none transition-all"
      >
        <option value="">-- Select conditions --</option>
        <option v-for="option in CONDITION_OPTIONS" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
    
    <!-- Tricks -->
    <div>
      <label class="block text-sm font-medium text-mountain-800 mb-2">
        Tricks
      </label>
      <input
        v-model="tricksInput"
        type="text"
        placeholder="Comma-separated (e.g. Ollie, 180, Grab)"
        class="w-full px-4 py-3 rounded-lg border-2 border-snow-300 focus:border-ice-500 focus:ring-2 focus:ring-ice-500/20 outline-none transition-all"
      />
    </div>
    
    <!-- Rating -->
    <div>
      <label class="block text-sm font-medium text-mountain-800 mb-2">
        Rating ⭐ (1-5)
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
    
    <!-- Notes -->
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
        v-if="isEditing"
        type="button"
        @click="$emit('cancel')"
        class="flex-1 px-6 py-3 bg-mountain-700 hover:bg-mountain-800 text-snow-50 rounded-lg transition-colors duration-200 font-medium"
      >
        Cancel
      </button>
      <button
        type="submit"
        :class="isEditing ? 'flex-1' : 'w-full'"
        class="px-6 py-3 bg-ice-500 hover:bg-ice-600 text-snow-50 rounded-lg transition-colors duration-200 font-medium shadow-lg"
      >
        {{ isEditing ? 'Update Session' : 'Create Session' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { CreateSessionInput, Session } from '~/types/session.types';
import { CONDITION_OPTIONS } from '~/constants/conditions';

const props = defineProps<{
  session?: Session | null;
  isEditing?: boolean;
}>();

const emit = defineEmits<{
  sessionCreated: [];
  submit: [session: Session];
  cancel: [];
}>();

const { createSession } = useSessions();

const isEditing = computed(() => props.isEditing && props.session);

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

// Watch for session changes when editing
watch(() => props.session, (newSession) => {
  if (newSession && props.isEditing) {
    const dateStr = new Date(newSession.date).toISOString().split('T')[0] || '';
    formData.value = {
      date: dateStr,
      station: newSession.station,
      conditions: newSession.conditions || '',
      tricks: [],
      notes: newSession.notes || '',
      photos: [],
      rating: newSession.rating,
      userId: newSession.userId,
    };
    tricksInput.value = newSession.tricks?.join(', ') || '';
  }
}, { immediate: true });

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = '';
    success.value = false;

    // Parse les tricks
    const tricks = tricksInput.value
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);

    if (isEditing.value && props.session) {
      // Mode édition
      const updatedSession: Session = {
        ...props.session,
        station: formData.value.station,
        date: new Date(formData.value.date),
        conditions: formData.value.conditions || null,
        tricks,
        rating: formData.value.rating,
        notes: formData.value.notes || null,
      };
      emit('submit', updatedSession);
    } else {
      // Mode création
      const sessionData: CreateSessionInput = {
        date: new Date(formData.value.date).toISOString(),
        station: formData.value.station,
        userId: formData.value.userId,
      };
      
      // Add optional fields only if they have values
      if (formData.value.conditions) {
        sessionData.conditions = formData.value.conditions;
      }
      if (tricks.length > 0) {
        sessionData.tricks = tricks;
      }
      if (formData.value.notes) {
        sessionData.notes = formData.value.notes;
      }
      if (formData.value.rating) {
        sessionData.rating = formData.value.rating;
      }
      
      await createSession(sessionData);

      success.value = true;
      emit('sessionCreated');
      
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
    }

  } catch (e: any) {
    error.value = e.message || 'Une erreur est survenue';
  } finally {
    loading.value = false;
  }
};
</script>