<script setup lang="ts">
import type { Session } from '~/types/session.types';

const store = useSessionsStore();

const { data: sessions, refresh: fetchSessions } = await useAsyncData(
  'sessions',
  () => store.load().then(() => store.sessions),
  { default: () => [] as Session[] }
);

const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedSession = ref<Session | null>(null);
const sessionToDelete = ref<string | null>(null);

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
    await store.update(id, {
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
  } catch (e: unknown) {
    console.error('Error updating session:', e);
  }
};

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
    await store.remove(sessionToDelete.value);
    await fetchSessions();
    closeDeleteModal();
  } catch (e: unknown) {
    console.error('Error deleting session:', e);
  }
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h2 class="heading-card">
        <UIcon name="i-lucide-list" class="text-3xl" />
        Tes Sessions ({{ sessions?.length ?? 0 }})
      </h2>
    </div>

    <!-- État vide -->
    <div v-if="!sessions?.length" class="text-center py-16">
      <UIcon name="i-lucide-snowflake" class="text-6xl text-mountain-300 mx-auto mb-4" />
      <p class="text-mountain-700 dark:text-mountain-200 text-lg mb-2">Aucune session pour le moment ! 🏂</p>
      <p class="text-muted">Crée ta première session pour commencer à tracker tes rides.
      </p>
    </div>

    <!-- Grille de sessions -->
    <div v-else class="card-grid-3 gap-6">
      <SessionsCard v-for="session in sessions" :key="session.id" :session="session" @edit="handleEdit"
        @delete="openDeleteModal" />
    </div>

    <!-- Modale d'édition -->
    <SessionsEditModal :is-open="isEditModalOpen" :session="selectedSession" @close="closeEditModal"
      @submit="handleUpdate" />

    <!-- Modale de suppression -->
    <SessionsDeleteModal :is-open="isDeleteModalOpen" @cancel="closeDeleteModal" @confirm="confirmDelete" />
  </div>
</template>