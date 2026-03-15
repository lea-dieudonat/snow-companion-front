<script setup lang="ts">
import type { CreateTripInput } from '@/types/trip.types';

const store = useTripsStore();
const { getAllStations } = useStations();

// ── État local ────────────────────────────────────────────────────────────────
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const tripToDelete = ref<string | null>(null);
const submitting = ref(false);
const formError = ref('');

// Recherche de station dans le formulaire
const stationQuery = ref('');
const stationResults = ref<{ value: string; label: string }[]>([]);
const searchingStations = ref(false);

// Formulaire
const form = ref<Omit<CreateTripInput, 'stationId'> & { stationId: string }>({
    name: '',
    startDate: '',
    endDate: '',
    stationId: '',
    notes: '',
});

// ── Recherche de stations (debounced) ─────────────────────────────────────────
let searchTimeout: ReturnType<typeof setTimeout>;
watch(stationQuery, (q) => {
    clearTimeout(searchTimeout);
    if (!q || q.length < 2) { stationResults.value = []; return; }
    searchTimeout = setTimeout(async () => {
        searchingStations.value = true;
        try {
            const results = await getAllStations({ search: q });
            stationResults.value = results.map(s => ({ value: s.id, label: `${s.name} — ${s.region}` }));
        } finally {
            searchingStations.value = false;
        }
    }, 300);
});

// ── Création ──────────────────────────────────────────────────────────────────
const handleSubmit = async () => {
    formError.value = '';
    if (!form.value.name || !form.value.startDate || !form.value.stationId) {
        formError.value = 'Le nom, la date de départ et la station sont requis.';
        return;
    }

    submitting.value = true;
    try {
        const input: CreateTripInput = {
            name: form.value.name,
            startDate: new Date(form.value.startDate).toISOString(),
            stationId: form.value.stationId,
        };
        if (form.value.endDate) input.endDate = new Date(form.value.endDate).toISOString();
        if (form.value.notes) input.notes = form.value.notes;

        await store.create(input);
        closeModal();
    } catch (e: unknown) {
        formError.value = e instanceof Error ? e.message : 'Erreur lors de la création';
    } finally {
        submitting.value = false;
    }
};

const closeModal = () => {
    isModalOpen.value = false;
    formError.value = '';
    stationQuery.value = '';
    stationResults.value = [];
    form.value = { name: '', startDate: '', endDate: '', stationId: '', notes: '' };
};

// ── Suppression ───────────────────────────────────────────────────────────────
const openDeleteModal = (id: string) => {
    tripToDelete.value = id;
    isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
    if (!tripToDelete.value) return;
    await store.remove(tripToDelete.value);
    isDeleteModalOpen.value = false;
    tripToDelete.value = null;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const daysUntil = (d: string) => {
    const diff = new Date(d).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Aujourd'hui !";
    if (days === 1) return 'Demain !';
    return `Dans ${days} jours`;
};

const statusColors: Record<string, string> = {
    planned: 'primary',
    confirmed: 'success',
    completed: 'neutral',
    cancelled: 'error',
};
const statusLabels: Record<string, string> = {
    planned: 'Planifié',
    confirmed: 'Confirmé',
    completed: 'Terminé',
    cancelled: 'Annulé',
};
</script>

<template>
    <section>
        <div class="flex items-center justify-between mb-4">
            <h3 class="heading-section">
                <UIcon name="i-lucide-calendar-check" class="text-ice-500" />
                Mon prochain voyage
            </h3>
            <UButton icon="i-lucide-plus" color="primary" variant="soft" size="sm" @click="isModalOpen = true">
                Planifier un trip
            </UButton>
        </div>

        <!-- Loading -->
        <AppLoader v-if="store.loading" size="sm" label="Chargement..." />

        <!-- Prochain trip -->
        <template v-else-if="store.nextTrip">
            <UCard class="border-l-4 border-l-ice-500">
                <!-- Hero du trip -->
                <div class="flex items-start justify-between gap-4 flex-wrap">
                    <div class="flex items-start gap-4">
                        <!-- Icône altitude -->
                        <div
                            class="w-12 h-12 rounded-xl bg-ice-100 dark:bg-ice-900/40 flex items-center justify-center shrink-0">
                            <UIcon name="i-lucide-mountain-snow" class="text-2xl text-ice-600 dark:text-ice-400" />
                        </div>
                        <div>
                            <h4 class="text-xl font-bold text-mountain-900 dark:text-snow-50 mb-1">
                                {{ store.nextTrip.name }}
                            </h4>
                            <p class="text-body flex items-center gap-2">
                                <UIcon name="i-lucide-map-pin" class="text-ice-500" />
                                {{ store.nextTrip.station.name }}
                                <span class="text-muted">· {{ store.nextTrip.station.region }}</span>
                            </p>
                        </div>
                    </div>

                    <!-- Badge compte à rebours -->
                    <div class="flex flex-col items-end gap-2">
                        <UBadge color="primary" variant="solid" size="lg" class="text-base font-bold px-4 py-1.5">
                            {{ daysUntil(store.nextTrip.startDate) }}
                        </UBadge>
                        <UBadge :color="statusColors[store.nextTrip.status] as 'primary'" variant="soft" size="sm">
                            {{ statusLabels[store.nextTrip.status] }}
                        </UBadge>
                    </div>
                </div>

                <!-- Dates + altitude -->
                <div class="mt-4 flex flex-wrap gap-3">
                    <div class="info-box flex items-center gap-2">
                        <UIcon name="i-lucide-calendar" class="text-ice-500 text-sm" />
                        <span class="text-sm text-mountain-700 dark:text-mountain-300">
                            {{ formatDate(store.nextTrip.startDate) }}
                            <template v-if="store.nextTrip.endDate">
                                → {{ formatDate(store.nextTrip.endDate) }}
                            </template>
                        </span>
                    </div>
                    <div class="info-box flex items-center gap-2">
                        <UIcon name="i-lucide-mountain" class="text-ice-500 text-sm" />
                        <span class="text-sm text-mountain-700 dark:text-mountain-300">
                            {{ store.nextTrip.station.altitudeMin }}m – {{ store.nextTrip.station.altitudeMax }}m
                        </span>
                    </div>
                </div>

                <!-- Notes -->
                <p v-if="store.nextTrip.notes"
                    class="mt-3 text-sm text-mountain-600 dark:text-mountain-300 bg-mountain-100/50 dark:bg-mountain-700/30 rounded-lg px-3 py-2">
                    {{ store.nextTrip.notes }}
                </p>

                <!-- Actions -->
                <div class="mt-4 flex gap-2 justify-end">
                    <UButton :to="`/stations/${store.nextTrip.stationId}`" color="primary" variant="soft" size="sm"
                        trailing-icon="i-lucide-arrow-right">
                        Voir la station
                    </UButton>
                    <UButton color="error" variant="soft" size="sm" icon="i-lucide-trash-2"
                        @click="openDeleteModal(store.nextTrip!.id)">
                        Supprimer
                    </UButton>
                </div>
            </UCard>

            <!-- Autres trips à venir (si plusieurs) -->
            <div v-if="store.upcomingTrips.length > 1" class="mt-3 space-y-2">
                <p class="text-label uppercase tracking-wide px-1">Autres voyages planifiés</p>
                <div v-for="trip in store.upcomingTrips.slice(1)" :key="trip.id"
                    class="flex items-center gap-3 px-3 py-2 rounded-lg bg-snow-100 dark:bg-mountain-800/50 border border-mountain-100 dark:border-mountain-700">
                    <UIcon name="i-lucide-calendar" class="text-mountain-400 shrink-0" />
                    <div class="flex-1 min-w-0">
                        <span class="font-medium text-mountain-800 dark:text-mountain-200 text-sm">{{ trip.name
                            }}</span>
                        <span class="text-muted text-xs ml-2">· {{ trip.station.name }}</span>
                    </div>
                    <span class="text-xs text-muted shrink-0">{{ formatDate(trip.startDate) }}</span>
                    <UButton color="error" variant="ghost" size="xs" icon="i-lucide-trash-2"
                        @click="openDeleteModal(trip.id)" />
                </div>
            </div>
        </template>

        <!-- État vide -->
        <AppEmptyState v-else label="Aucun voyage planifié"
            description="Ajoute ton prochain trip pour le voir apparaître ici" icon="i-lucide-map-pinned" dashed>
            <UButton icon="i-lucide-plus" color="primary" variant="soft" @click="isModalOpen = true">
                Planifier un trip
            </UButton>
        </AppEmptyState>

        <!-- ── Modal création ────────────────────────────────────────────────── -->
        <UModal v-model:open="isModalOpen" title="Planifier un trip" :close="{ onClick: closeModal }">
            <template #body>
                <div class="space-y-4 p-1">
                    <UAlert v-if="formError" color="error" variant="soft" icon="i-lucide-alert-circle"
                        :title="formError" />

                    <!-- Nom du trip -->
                    <UFormField label="Nom du trip" required>
                        <UInput v-model="form.name" placeholder="Ex: Weekend aux Deux Alpes" icon="i-lucide-tag"
                            size="lg" class="w-full" />
                    </UFormField>

                    <!-- Recherche station -->
                    <UFormField label="Station" required>
                        <UInput v-model="stationQuery" placeholder="Rechercher une station..." icon="i-lucide-search"
                            size="lg" class="w-full mb-2" />
                        <div v-if="searchingStations" class="text-xs text-muted px-1">Recherche...</div>
                        <div v-else-if="stationResults.length"
                            class="border border-mountain-200 dark:border-mountain-700 rounded-lg overflow-hidden">
                            <button v-for="s in stationResults" :key="s.value"
                                class="w-full text-left px-3 py-2 text-sm hover:bg-ice-50 dark:hover:bg-ice-900/20 transition-colors flex items-center gap-2"
                                :class="form.stationId === s.value ? 'bg-ice-100 dark:bg-ice-900/40 font-semibold text-ice-700 dark:text-ice-300' : 'text-mountain-800 dark:text-mountain-200'"
                                type="button"
                                @click="form.stationId = s.value; stationQuery = s.label; stationResults = []">
                                <UIcon name="i-lucide-mountain" class="text-ice-400 shrink-0" />
                                {{ s.label }}
                                <UIcon v-if="form.stationId === s.value" name="i-lucide-check"
                                    class="ml-auto text-ice-500" />
                            </button>
                        </div>
                        <p v-if="form.stationId && !stationResults.length"
                            class="text-xs text-forest-600 dark:text-forest-400 flex items-center gap-1 px-1 mt-1">
                            <UIcon name="i-lucide-check-circle" />
                            Station sélectionnée
                        </p>
                    </UFormField>

                    <!-- Dates -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <UFormField label="Date de départ" required>
                            <UInput v-model="form.startDate" type="date" icon="i-lucide-calendar" size="lg"
                                class="w-full" />
                        </UFormField>
                        <UFormField label="Date de retour">
                            <UInput v-model="form.endDate" type="date" icon="i-lucide-calendar-check" size="lg"
                                class="w-full" />
                        </UFormField>
                    </div>

                    <!-- Notes -->
                    <UFormField label="Notes">
                        <UTextarea v-model="form.notes" :rows="2" placeholder="Équipement à prévoir, hôtel réservé..."
                            class="w-full" />
                    </UFormField>
                </div>
            </template>

            <template #footer>
                <div class="flex gap-3 w-full">
                    <UButton color="neutral" variant="outline" block @click="closeModal">
                        Annuler
                    </UButton>
                    <UButton color="primary" block icon="i-lucide-save" :loading="submitting" @click="handleSubmit">
                        Créer le trip
                    </UButton>
                </div>
            </template>
        </UModal>

        <!-- ── Modal suppression ──────────────────────────────────────────────── -->
        <UModal v-model:open="isDeleteModalOpen" title="Supprimer ce trip ?">
            <template #body>
                <p class="text-body">Cette action est irréversible.</p>
            </template>
            <template #footer>
                <div class="flex gap-3 w-full">
                    <UButton color="neutral" variant="outline" block @click="isDeleteModalOpen = false">
                        Annuler
                    </UButton>
                    <UButton color="error" block icon="i-lucide-trash-2" @click="confirmDelete">
                        Supprimer
                    </UButton>
                </div>
            </template>
        </UModal>
    </section>
</template>