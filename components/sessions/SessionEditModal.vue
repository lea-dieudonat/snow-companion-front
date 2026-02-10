<script setup lang="ts">
import type { Session } from '~/types/session.types';

const props = defineProps<{
  session: Session;
}>();

const emit = defineEmits<{
  close: [];
  updated: [];
}>();

const { updateSession } = useSessions();

const formData = ref({
  date: new Date(props.session.date).toISOString().split('T')[0],
  station: props.session.station,
  conditions: props.session.conditions || '',
  tricks: props.session.tricks || [],
  notes: props.session.notes || '',
});

const tricksInput = ref(props.session.tricks?.join(', ') || '');
const loading = ref(false);
const error = ref('');

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = '';

    const tricks = tricksInput.value
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);

    await updateSession(props.session.id, {
      ...formData.value,
      tricks,
      date: new Date(formData.value.date || '').toISOString(),
      userId: props.session.userId,
    });

    emit('updated');
  } catch (e: any) {
    error.value = e.message || 'Erreur lors de la modification';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="modal-overlay" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>✏️ Modifier la session</h2>
        <button class="close-btn" @click="emit('close')">✕</button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="edit-date">Date *</label>
          <input
            id="edit-date"
            v-model="formData.date"
            type="date"
            required
          />
        </div>

        <div class="form-group">
          <label for="edit-station">Station *</label>
          <input
            id="edit-station"
            v-model="formData.station"
            type="text"
            required
          />
        </div>

        <div class="form-group">
          <label for="edit-conditions">Conditions</label>
          <input
            id="edit-conditions"
            v-model="formData.conditions"
            type="text"
          />
        </div>

        <div class="form-group">
          <label for="edit-tricks">Tricks réussis</label>
          <input
            id="edit-tricks"
            v-model="tricksInput"
            type="text"
            placeholder="Sépare par des virgules"
          />
        </div>

        <div class="form-group">
          <label for="edit-notes">Notes</label>
          <textarea
            id="edit-notes"
            v-model="formData.notes"
            rows="4"
          />
        </div>

        <div v-if="error" class="error">{{ error }}</div>

        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="emit('close')">
            Annuler
          </button>
          <button type="submit" class="btn-save" :disabled="loading">
            {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f0f0f0;
  color: #333;
}

form {
  padding: 1.5rem;
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

.error {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #ffebee;
  color: #c62828;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel,
.btn-save {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #e0e0e0;
  color: #333;
}

.btn-cancel:hover {
  background: #d0d0d0;
}

.btn-save {
  background: #4CAF50;
  color: white;
}

.btn-save:hover:not(:disabled) {
  background: #45a049;
}

.btn-save:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>