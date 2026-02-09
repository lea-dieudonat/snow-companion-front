<template>
  <div class="session-form">
    <h2>🏂 Nouvelle Session</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="date">Date *</label>
        <input
          id="date"
          v-model="formData.date"
          type="date"
          required
        />
      </div>

      <div class="form-group">
        <label for="station">Station *</label>
        <input
          id="station"
          v-model="formData.station"
          type="text"
          placeholder="Ex: Chamonix"
          required
        />
      </div>

      <div class="form-group">
        <label for="conditions">Conditions</label>
        <input
          id="conditions"
          v-model="formData.conditions"
          type="text"
          placeholder="Ex: Powder day!"
        />
      </div>

      <div class="form-group">
        <label for="tricks">Tricks réussis</label>
        <input
          id="tricks"
          v-model="tricksInput"
          type="text"
          placeholder="Sépare par des virgules: 360, Backflip"
        />
      </div>

      <div class="form-group">
        <label for="notes">Notes</label>
        <textarea
          id="notes"
          v-model="formData.notes"
          placeholder="Ton meilleur souvenir de la journée..."
          rows="4"
        />
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="loading">
          {{ loading ? 'Enregistrement...' : 'Enregistrer la session' }}
        </button>
      </div>

      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="success" class="success">Session créée avec succès ! 🎉</div>
    </form>
  </div>
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

<style scoped>
.session-form {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

input, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #4CAF50;
}

.form-actions {
  margin-top: 2rem;
}

button {
  width: 100%;
  padding: 1rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover:not(:disabled) {
  background: #45a049;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error {
  margin-top: 1rem;
  padding: 1rem;
  background: #ffebee;
  color: #c62828;
  border-radius: 4px;
}

.success {
  margin-top: 1rem;
  padding: 1rem;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 4px;
}
</style>