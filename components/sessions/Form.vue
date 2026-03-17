<template>
  <form class="bg-snow-50 dark:bg-mountain-800 rounded-lg shadow-card p-6" @submit.prevent="handleSubmit">
    <h2 v-if="!isEditing" class="heading-card mb-6">
      <UIcon name="i-lucide-plus-circle" />
      Nouvelle session
    </h2>

    <UAlert v-if="error" color="error" variant="soft" icon="i-lucide-alert-circle" :title="error" class="mb-6" />
    <UAlert v-if="success" color="success" variant="soft" icon="i-lucide-check-circle"
      title="Session créée avec succès !" class="mb-6" />

    <div class="space-y-6">

      <!-- ── Infos générales ──────────────────────────────────────────── -->
      <div class="space-y-5">
        <UFormField label="Station" required>
          <UInput v-model="formData.station" icon="i-lucide-mountain" placeholder="Ex: Les 3 Vallées" size="lg"
            class="w-full" required />
        </UFormField>

        <UFormField label="Date" required>
          <UInput v-model="formData.date" type="date" icon="i-lucide-calendar" size="lg" class="w-full" required />
        </UFormField>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField label="Conditions">
            <USelect v-model="formData.conditions" :items="CONDITION_OPTIONS" placeholder="-- Conditions --" size="lg"
              class="w-full" />
          </UFormField>
          <UFormField label="Note (1-5)">
            <UInput v-model.number="formData.rating" type="number" min="1" max="5" icon="i-lucide-star" placeholder="3"
              size="lg" class="w-full" />
          </UFormField>
        </div>

        <UFormField label="Tricks" hint="Sépare les tricks par des virgules">
          <UInput v-model="tricksInput" icon="i-lucide-sparkles" placeholder="Ex: Ollie, 180, Grab" size="lg"
            class="w-full" />
        </UFormField>

        <UFormField label="Notes">
          <UTextarea v-model="formData.notes" :rows="3" placeholder="Comment était la neige ? Des nouveaux tricks ?"
            size="lg" class="w-full" />
        </UFormField>
      </div>

      <!-- ── Performances ────────────────────────────────────────────── -->
      <div>
        <div class="flex items-center gap-2 mb-4">
          <UIcon name="i-lucide-gauge" class="text-ice-500" />
          <h3 class="text-sm font-semibold text-mountain-700 dark:text-mountain-300 uppercase tracking-wide">
            Performances <span class="text-mountain-400 font-normal normal-case tracking-normal">(optionnel)</span>
          </h3>
          <UDivider class="flex-1" />
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <UFormField label="Descentes">
            <UInput v-model.number="formData.runCount" type="number" min="0" placeholder="12" size="lg" class="w-full">
              <template #trailing>
                <span class="text-xs text-mountain-400">runs</span>
              </template>
            </UInput>
          </UFormField>

          <UFormField label="Vitesse max">
            <UInput v-model.number="formData.maxSpeed" type="number" min="0" step="0.1" placeholder="87" size="lg"
              class="w-full">
              <template #trailing>
                <span class="text-xs text-mountain-400">km/h</span>
              </template>
            </UInput>
          </UFormField>

          <UFormField label="Distance">
            <UInput v-model.number="formData.totalDistance" type="number" min="0" step="0.1" placeholder="34" size="lg"
              class="w-full">
              <template #trailing>
                <span class="text-xs text-mountain-400">km</span>
              </template>
            </UInput>
          </UFormField>

          <UFormField label="Dénivelé">
            <UInput v-model.number="formData.verticalDrop" type="number" min="0" placeholder="4200" size="lg"
              class="w-full">
              <template #trailing>
                <span class="text-xs text-mountain-400">m</span>
              </template>
            </UInput>
          </UFormField>
        </div>
      </div>

      <!-- ── Actions ─────────────────────────────────────────────────── -->
      <div class="flex gap-3 pt-2">
        <UButton v-if="isEditing" type="button" color="neutral" variant="outline" size="lg" block
          @click="$emit('cancel')">
          Annuler
        </UButton>
        <UButton type="submit" color="primary" size="lg" :block="!isEditing" :loading="loading" icon="i-lucide-save"
          class="whitespace-nowrap">
          {{ isEditing ? 'Mettre à jour' : 'Créer la session' }}
        </UButton>
      </div>
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

const store = useSessionsStore();
const userStore = useUserStore();

const isEditing = computed(() => props.isEditing && props.session);

const emptyForm = (): CreateSessionInput => ({
  date: new Date().toISOString().split('T')[0] as string,
  station: '',
  conditions: '',
  tricks: [],
  notes: '',
  photos: [],
  rating: undefined,
  runCount: undefined,
  maxSpeed: undefined,
  totalDistance: undefined,
  verticalDrop: undefined,
  userId: userStore.userId!,
});

const formData = ref<CreateSessionInput>(emptyForm());
const tricksInput = ref('');
const loading = ref(false);
const error = ref('');
const success = ref(false);

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
      runCount: newSession.runCount ?? undefined,
      maxSpeed: newSession.maxSpeed ?? undefined,
      totalDistance: newSession.totalDistance ?? undefined,
      verticalDrop: newSession.verticalDrop ?? undefined,
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

    const tricks = tricksInput.value
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);

    if (isEditing.value && props.session) {
      const updatedSession: Session = {
        ...props.session,
        station: formData.value.station,
        date: formData.value.date,
        conditions: formData.value.conditions || null,
        tricks,
        rating: formData.value.rating,
        notes: formData.value.notes || null,
        runCount: formData.value.runCount ?? null,
        maxSpeed: formData.value.maxSpeed ?? null,
        totalDistance: formData.value.totalDistance ?? null,
        verticalDrop: formData.value.verticalDrop ?? null,
      };
      emit('submit', updatedSession);
    } else {
      const sessionData: CreateSessionInput = {
        date: new Date(formData.value.date).toISOString(),
        station: formData.value.station,
        userId: formData.value.userId,
      };
      if (formData.value.conditions) sessionData.conditions = formData.value.conditions;
      if (tricks.length > 0) sessionData.tricks = tricks;
      if (formData.value.notes) sessionData.notes = formData.value.notes;
      if (formData.value.rating) sessionData.rating = formData.value.rating;
      if (formData.value.runCount) sessionData.runCount = formData.value.runCount;
      if (formData.value.maxSpeed) sessionData.maxSpeed = formData.value.maxSpeed;
      if (formData.value.totalDistance) sessionData.totalDistance = formData.value.totalDistance;
      if (formData.value.verticalDrop) sessionData.verticalDrop = formData.value.verticalDrop;

      await store.create(sessionData);
      success.value = true;
      emit('sessionCreated');
      formData.value = emptyForm();
      tricksInput.value = '';
    }
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Une erreur est survenue';
  } finally {
    loading.value = false;
  }
};
</script>