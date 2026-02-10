<script setup lang="ts">
import type { Session } from '../../types/session.types';

const { getAllSessions, deleteSession } = useSessions();

const sessions = ref<Session[]>([]);
const loading = ref(true);
const error = ref('');

const fetchSessions = async () => {
  try {
    loading.value = true;
    error.value = '';
    const result = await getAllSessions();
    sessions.value = result || [];
  } catch (e: any) {
    error.value = e.message || 'Erreur lors du chargement des sessions';
  } finally {
    loading.value = false;
  }
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const handleDelete = async (sessionId: string) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette session ?')) {
    return;
  }
  try {
    await deleteSession(sessionId);
    await fetchSessions();
  } catch (e: any) {
    error.value = e.message || 'Erreur lors de la suppression de la session';
  }
};

const editingSession = ref<Session | null>(null);

const handleEdit = (session: Session) => {
  editingSession.value = session;
};

const handleCancelEdit = () => {
  editingSession.value = null;
};

const handleUpdateSuccess = async () => {
  editingSession.value = null;
  await fetchSessions();
};

// Charge les sessions au montage du composant
onMounted(() => {
  fetchSessions();
});

// Expose la méthode pour recharger depuis le parent
defineExpose({ fetchSessions });
</script>

<template>
  <div class="session-list">
    <h2>📖 Mes Sessions</h2>

    <!-- Modal d'édition -->
    <SessionsSessionEditModal
      v-if="editingSession"
      :session="editingSession"
      @close="handleCancelEdit"
      @updated="handleUpdateSuccess"
    />

    <div v-if="loading" class="loading">
      Chargement des sessions...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="sessions.length === 0" class="empty">
      Aucune session enregistrée pour le moment. 🏂
      <br>
      Crée ta première session ci-dessus !
    </div>

    <div v-else class="sessions-grid">
      <div 
        v-for="session in sessions" 
        :key="session.id" 
        class="session-card"
      >
        <div class="session-header">
          <h3>{{ session.station }}</h3>
          <span class="session-date">{{ formatDate(session.date) }}</span>
        </div>

        <div v-if="session.conditions" class="session-conditions">
          ☁️ {{ session.conditions }}
        </div>

        <div v-if="session.tricks && session.tricks.length > 0" class="session-tricks">
          <strong>Tricks réussis :</strong>
          <div class="tricks-list">
            <span 
              v-for="trick in session.tricks" 
              :key="trick" 
              class="trick-badge"
            >
              {{ trick }}
            </span>
          </div>
        </div>

        <div v-if="session.notes" class="session-notes">
          💭 {{ session.notes }}
        </div>

        <div class="session-actions">
          <button class="btn-edit" @click="handleEdit(session)">
            ✏️ Modifier
          </button>
          <button class="btn-delete" @click="handleDelete(session.id)">
            🗑️ Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.session-list {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
}

h2 {
  color: white;
  margin-bottom: 2rem;
  font-size: 2rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.loading, .empty {
  text-align: center;
  color: white;
  font-size: 1.2rem;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.error {
  padding: 1rem;
  background: #ffebee;
  color: #c62828;
  border-radius: 8px;
  text-align: center;
}

.sessions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.session-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: transform 0.2s, box-shadow 0.2s;
}

.session-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.session-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.session-date {
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
}

.session-conditions {
  margin-bottom: 1rem;
  color: #555;
  font-style: italic;
}

.session-tricks {
  margin-bottom: 1rem;
}

.session-tricks strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
}

.tricks-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.trick-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.session-notes {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
  color: #666;
  font-style: italic;
}

.session-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.btn-edit,
.btn-delete {
  flex: 1;
  padding: 0.6rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit {
  background: #4CAF50;
  color: white;
}

.btn-edit:hover {
  background: #45a049;
}

.btn-delete {
  background: #f44336;
  color: white;
}

.btn-delete:hover {
  background: #da190b;
}
</style>