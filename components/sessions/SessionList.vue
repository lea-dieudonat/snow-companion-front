<script setup lang="ts">
import type { Session } from '~/types/session.types';

const { getAllSessions, updateSession, deleteSession } = useSessions();

const { data: sessions, refresh: fetchSessions } = await useAsyncData(
  'sessions',
  () => getAllSessions(),
  { default: () => [] as Session[] }
);
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const selectedSession = ref<Session | null>(null)
const sessionToDelete = ref<string | null>(null)

// Edit
const handleEdit = (session: Session) => {
  selectedSession.value = session;
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  selectedSession.value = null;
};

const handleUpdate = async ({ id, date, station, conditions, tricks, notes, rating, userId }: Session) => {
  try {
    await updateSession(id, {
      date: new Date(date).toISOString(),
      station,
      conditions: conditions || undefined,
      tricks,
      notes: notes || undefined,
      rating,
      userId,
    });
    await fetchSessions();
    closeEditModal();
  } catch (e: any) {
    console.error('Error updating session:', e);
  }
};

// Delete
const openDeleteModal = (id: string) => {
  sessionToDelete.value = id;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  sessionToDelete.value = null;
};

const confirmDelete = async () => {
  if (sessionToDelete.value === null) return;
  
  try {
    await deleteSession(sessionToDelete.value);
    await fetchSessions();
    closeDeleteModal();
  } catch (e: any) {
    console.error('Error deleting session:', e);
  }
};

</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold text-mountain-900">
        Your Sessions ({{ sessions?.length ?? 0 }})
      </h2>
    </div>
    
    <div v-if="!sessions?.length" class="text-center py-16">
      <p class="text-mountain-600 text-lg mb-4">No sessions yet! 🏂</p>
      <p class="text-mountain-500">Create your first session to start tracking your rides.</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <SessionsSessionCard
        v-for="session in sessions"
        :key="session.id"
        :session="session"
        @edit="handleEdit"
        @delete="openDeleteModal"
      />
    </div>

    <!-- Modale d'édition -->
    <SessionsSessionEditModal
      :is-open="isEditModalOpen"
      :session="selectedSession"
      @close="closeEditModal"
      @submit="handleUpdate"
    />

    <!-- Modale de confirmation de suppression -->
    <SessionsSessionDeleteModal
      :is-open="isDeleteModalOpen"
      @cancel="closeDeleteModal"
      @confirm="confirmDelete"
    />
  </div>
</template>