<script setup lang="ts">
import type { UpsertProfilePayload } from '@/composables/useProfile';

definePageMeta({ layout: 'default', middleware: 'auth' });

const { profile, loading, saving, error, load, save } = useProfile();

onMounted(load);

// ── Options ──────────────────────────────────────────────────────────────────
const DISCIPLINES = [
  { value: 'ski', label: 'Ski alpin' },
  { value: 'snowboard', label: 'Snowboard' },
  { value: 'telemark', label: 'Télémark' },
  { value: 'ski_touring', label: 'Ski de randonnée' },
  { value: 'cross_country', label: 'Ski de fond' },
];

const RIDE_STYLES = [
  { value: 'piste', label: 'Piste' },
  { value: 'freeride', label: 'Freeride' },
  { value: 'freestyle', label: 'Freestyle' },
  { value: 'backcountry', label: 'Hors-piste' },
  { value: 'moguls', label: 'Bosses' },
];

const LEVELS = [
  { value: 'beginner', label: 'Débutant' },
  { value: 'intermediate', label: 'Intermédiaire' },
  { value: 'advanced', label: 'Avancé' },
  { value: 'expert', label: 'Expert' },
];

const FREESTYLE_LEVELS = [
  { value: 'none', label: 'Aucun' },
  { value: 'beginner', label: 'Débutant' },
  { value: 'intermediate', label: 'Intermédiaire' },
  { value: 'advanced', label: 'Avancé' },
];

const SNOW_PREFERENCES = [
  { value: 'groomed', label: 'Piste damée' },
  { value: 'powder', label: 'Poudreuse' },
  { value: 'mixed', label: 'Les deux' },
];

const REGIONS = [
  { value: 'alpes_nord', label: 'Alpes du Nord' },
  { value: 'alpes_sud', label: 'Alpes du Sud' },
  { value: 'pyrenees', label: 'Pyrénées' },
  { value: 'massif_central', label: 'Massif Central' },
  { value: 'vosges', label: 'Vosges' },
  { value: 'jura', label: 'Jura' },
];

const BUDGET_RANGES = [
  { value: 'budget', label: 'Petit budget' },
  { value: 'mid', label: 'Moyen' },
  { value: 'premium', label: 'Premium' },
];

// ── Formulaire ───────────────────────────────────────────────────────────────
const form = reactive<UpsertProfilePayload>({
  disciplines: [],
  primaryDiscipline: undefined,
  rideStyles: [],
  freestyleLevel: undefined,
  snowPreference: undefined,
  offPiste: null,
  level: undefined,
  withChildren: null,
  regions: [],
  budgetRange: undefined,
});

// Pré-remplissage quand le profil est chargé
watch(profile, (p) => {
  if (!p) return;
  form.disciplines = [...p.disciplines];
  form.primaryDiscipline = p.primaryDiscipline ?? undefined;
  form.rideStyles = [...p.rideStyles];
  form.freestyleLevel = p.freestyleLevel ?? undefined;
  form.snowPreference = p.snowPreference ?? undefined;
  form.offPiste = p.offPiste;
  form.level = p.level ?? undefined;
  form.withChildren = p.withChildren;
  form.regions = [...p.regions];
  form.budgetRange = p.budgetRange ?? undefined;
}, { immediate: true });

// La discipline principale doit être dans les disciplines sélectionnées
const primaryDisciplineOptions = computed(() =>
  DISCIPLINES.filter(d => form.disciplines.includes(d.value))
);
watch(() => form.disciplines, (disciplines) => {
  if (form.primaryDiscipline && !disciplines.includes(form.primaryDiscipline)) {
    form.primaryDiscipline = disciplines[0];
  }
});

const hasFreestyle = computed(() => form.rideStyles.includes('freestyle'));

// ── Soumission ───────────────────────────────────────────────────────────────
const success = ref(false);

const handleSubmit = async () => {
  success.value = false;
  const ok = await save({ ...form });
  if (ok) success.value = true;
};

const toggleItem = (arr: string[], value: string) => {
  const idx = arr.indexOf(value);
  if (idx > -1) arr.splice(idx, 1);
  else arr.push(value);
};
</script>

<template>
  <div class="page-container-sm">
    <AppPageHeader title="Paramètres" icon="i-lucide-settings" />

    <!-- Profil rider ─────────────────────────────────────────────────────── -->
    <UCard class="mb-6">
      <template #header>
        <h2 class="heading-card">
          <UIcon name="i-lucide-user-circle" class="text-ice-500" />
          Profil rider
        </h2>
      </template>

      <AppLoader v-if="loading" />

      <form v-else class="space-y-6" @submit.prevent="handleSubmit">

        <!-- Disciplines ──────────────────────────────────────────────────── -->
        <div>
          <p class="text-sm font-semibold text-mountain-800 dark:text-snow-100 mb-2">
            Disciplines <span class="text-error-500">*</span>
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="d in DISCIPLINES"
              :key="d.value"
              type="button"
              class="px-3 py-1.5 rounded-full text-sm border transition-colors"
              :class="form.disciplines.includes(d.value)
                ? 'bg-ice-500 border-ice-500 text-white'
                : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400'"
              @click="toggleItem(form.disciplines, d.value)"
            >
              {{ d.label }}
            </button>
          </div>
        </div>

        <!-- Discipline principale ────────────────────────────────────────── -->
        <div v-if="primaryDisciplineOptions.length > 1">
          <p class="text-sm font-semibold text-mountain-800 dark:text-snow-100 mb-2">Discipline principale</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="d in primaryDisciplineOptions"
              :key="d.value"
              type="button"
              class="px-3 py-1.5 rounded-full text-sm border transition-colors"
              :class="form.primaryDiscipline === d.value
                ? 'bg-forest-500 border-forest-500 text-white'
                : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-forest-400'"
              @click="form.primaryDiscipline = d.value"
            >
              {{ d.label }}
            </button>
          </div>
        </div>

        <!-- Niveau ───────────────────────────────────────────────────────── -->
        <div>
          <p class="text-sm font-semibold text-mountain-800 dark:text-snow-100 mb-2">Niveau</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="l in LEVELS"
              :key="l.value"
              type="button"
              class="px-3 py-1.5 rounded-full text-sm border transition-colors"
              :class="form.level === l.value
                ? 'bg-ice-500 border-ice-500 text-white'
                : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400'"
              @click="form.level = form.level === l.value ? undefined : l.value"
            >
              {{ l.label }}
            </button>
          </div>
        </div>

        <!-- Styles de ride ───────────────────────────────────────────────── -->
        <div>
          <p class="text-sm font-semibold text-mountain-800 dark:text-snow-100 mb-2">Styles de ride</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="s in RIDE_STYLES"
              :key="s.value"
              type="button"
              class="px-3 py-1.5 rounded-full text-sm border transition-colors"
              :class="form.rideStyles.includes(s.value)
                ? 'bg-ice-500 border-ice-500 text-white'
                : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400'"
              @click="toggleItem(form.rideStyles, s.value)"
            >
              {{ s.label }}
            </button>
          </div>
        </div>

        <!-- Niveau freestyle (si freestyle sélectionné) ───────────────────── -->
        <div v-if="hasFreestyle">
          <p class="text-sm font-semibold text-mountain-800 dark:text-snow-100 mb-2">Niveau freestyle</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="fl in FREESTYLE_LEVELS"
              :key="fl.value"
              type="button"
              class="px-3 py-1.5 rounded-full text-sm border transition-colors"
              :class="form.freestyleLevel === fl.value
                ? 'bg-ice-500 border-ice-500 text-white'
                : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400'"
              @click="form.freestyleLevel = form.freestyleLevel === fl.value ? undefined : fl.value"
            >
              {{ fl.label }}
            </button>
          </div>
        </div>

        <!-- Préférence neige ─────────────────────────────────────────────── -->
        <div>
          <p class="text-sm font-semibold text-mountain-800 dark:text-snow-100 mb-2">Préférence neige</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="sp in SNOW_PREFERENCES"
              :key="sp.value"
              type="button"
              class="px-3 py-1.5 rounded-full text-sm border transition-colors"
              :class="form.snowPreference === sp.value
                ? 'bg-ice-500 border-ice-500 text-white'
                : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400'"
              @click="form.snowPreference = form.snowPreference === sp.value ? undefined : sp.value"
            >
              {{ sp.label }}
            </button>
          </div>
        </div>

        <!-- Régions ──────────────────────────────────────────────────────── -->
        <div>
          <p class="text-sm font-semibold text-mountain-800 dark:text-snow-100 mb-2">Régions préférées</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="r in REGIONS"
              :key="r.value"
              type="button"
              class="px-3 py-1.5 rounded-full text-sm border transition-colors"
              :class="form.regions.includes(r.value)
                ? 'bg-ice-500 border-ice-500 text-white'
                : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400'"
              @click="toggleItem(form.regions, r.value)"
            >
              {{ r.label }}
            </button>
          </div>
        </div>

        <!-- Budget ───────────────────────────────────────────────────────── -->
        <div>
          <p class="text-sm font-semibold text-mountain-800 dark:text-snow-100 mb-2">Budget</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="b in BUDGET_RANGES"
              :key="b.value"
              type="button"
              class="px-3 py-1.5 rounded-full text-sm border transition-colors"
              :class="form.budgetRange === b.value
                ? 'bg-ice-500 border-ice-500 text-white'
                : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400'"
              @click="form.budgetRange = form.budgetRange === b.value ? undefined : b.value"
            >
              {{ b.label }}
            </button>
          </div>
        </div>

        <!-- Hors-piste ──────────────────────────────────────────────────── -->
        <div>
          <p class="text-sm font-semibold text-mountain-800 dark:text-snow-100 mb-1">Hors-piste</p>
          <p class="text-xs text-muted mb-2">Je skie / ride hors des pistes balisées</p>
          <div class="flex gap-2">
            <button
              v-for="opt in ([{ label: 'Oui', value: true }, { label: 'Non', value: false }, { label: 'Non renseigné', value: null }] as const)"
              :key="String(opt.value)"
              type="button"
              class="px-3 py-1.5 rounded-full text-sm border transition-colors"
              :class="form.offPiste === opt.value
                ? 'bg-ice-500 border-ice-500 text-white'
                : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400'"
              @click="form.offPiste = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- Avec enfants ─────────────────────────────────────────────────── -->
        <div>
          <p class="text-sm font-semibold text-mountain-800 dark:text-snow-100 mb-1">Avec enfants</p>
          <p class="text-xs text-muted mb-2">Je voyage avec des enfants</p>
          <div class="flex gap-2">
            <button
              v-for="opt in ([{ label: 'Oui', value: true }, { label: 'Non', value: false }, { label: 'Non renseigné', value: null }] as const)"
              :key="String(opt.value)"
              type="button"
              class="px-3 py-1.5 rounded-full text-sm border transition-colors"
              :class="form.withChildren === opt.value
                ? 'bg-ice-500 border-ice-500 text-white'
                : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400'"
              @click="form.withChildren = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- Erreur / succès ──────────────────────────────────────────────── -->
        <UAlert v-if="error" color="error" variant="soft" icon="i-lucide-alert-triangle" :description="error" />
        <UAlert
          v-if="success"
          color="success"
          variant="soft"
          icon="i-lucide-check-circle"
          description="Profil sauvegardé — l'agent utilisera ces informations lors des prochaines conversations."
        />

        <!-- Bouton ───────────────────────────────────────────────────────── -->
        <UButton
          type="submit"
          color="primary"
          block
          icon="i-lucide-save"
          :loading="saving"
          :disabled="form.disciplines.length === 0"
        >
          Sauvegarder le profil
        </UButton>
      </form>
    </UCard>
  </div>
</template>
