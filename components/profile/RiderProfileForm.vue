<script setup lang="ts">
import type { UserProfile, UpsertProfilePayload } from '@/composables/useProfile';
import {
  DISCIPLINES, RIDE_STYLES, LEVELS, FREESTYLE_LEVELS,
  SNOW_PREFERENCES, REGIONS, BUDGET_RANGES, BOOLEAN_OPTIONS,
} from '@/constants/profile.constants';

const props = defineProps<{
  profile: UserProfile | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: boolean;
  compact?: boolean;
}>();

const emit = defineEmits<{
  submit: [payload: UpsertProfilePayload];
}>();

// ── Tailles dynamiques selon compact ─────────────────────────────────────────
const s = computed(() => props.compact
  ? { label: 'text-xs', mb: 'mb-1.5', gap: 'gap-1.5', btn: 'px-2.5 py-1 text-xs', space: 'space-y-4' }
  : { label: 'text-sm', mb: 'mb-2',   gap: 'gap-2',   btn: 'px-3 py-1.5 text-sm',  space: 'space-y-6' },
);

// ── État du formulaire ────────────────────────────────────────────────────────
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

watch(() => props.profile, (p) => {
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

const primaryDisciplineOptions = computed(() =>
  DISCIPLINES.filter(d => form.disciplines.includes(d.value)),
);

watch(() => form.disciplines, (disciplines) => {
  if (form.primaryDiscipline && !disciplines.includes(form.primaryDiscipline)) {
    form.primaryDiscipline = disciplines[0];
  }
});

const hasFreestyle = computed(() => form.rideStyles.includes('freestyle'));

function toggleItem(arr: string[], value: string): void {
  const idx = arr.indexOf(value);
  if (idx > -1) arr.splice(idx, 1);
  else arr.push(value);
}

const handleSubmit = () => emit('submit', { ...form });
</script>

<template>
  <AppLoader v-if="loading" />

  <form v-else :class="s.space" @submit.prevent="handleSubmit">

    <!-- Disciplines ─────────────────────────────────────────────────────────── -->
    <div>
      <p :class="[s.label, s.mb, 'font-semibold text-mountain-800 dark:text-snow-100']">
        Disciplines <span class="text-error-500">*</span>
      </p>
      <div :class="['flex flex-wrap', s.gap]">
        <button
          v-for="d in DISCIPLINES" :key="d.value" type="button"
          :class="[s.btn, 'rounded-full border transition-colors',
            form.disciplines.includes(d.value)
              ? 'bg-ice-500 border-ice-500 text-white'
              : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400']"
          @click="toggleItem(form.disciplines, d.value)"
        >{{ d.label }}</button>
      </div>
    </div>

    <!-- Discipline principale ───────────────────────────────────────────────── -->
    <div v-if="primaryDisciplineOptions.length > 1">
      <p :class="[s.label, s.mb, 'font-semibold text-mountain-800 dark:text-snow-100']">Discipline principale</p>
      <div :class="['flex flex-wrap', s.gap]">
        <button
          v-for="d in primaryDisciplineOptions" :key="d.value" type="button"
          :class="[s.btn, 'rounded-full border transition-colors',
            form.primaryDiscipline === d.value
              ? 'bg-forest-500 border-forest-500 text-white'
              : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-forest-400']"
          @click="form.primaryDiscipline = d.value"
        >{{ d.label }}</button>
      </div>
    </div>

    <!-- Niveau ──────────────────────────────────────────────────────────────── -->
    <div>
      <p :class="[s.label, s.mb, 'font-semibold text-mountain-800 dark:text-snow-100']">Niveau</p>
      <div :class="['flex flex-wrap', s.gap]">
        <button
          v-for="l in LEVELS" :key="l.value" type="button"
          :class="[s.btn, 'rounded-full border transition-colors',
            form.level === l.value
              ? 'bg-ice-500 border-ice-500 text-white'
              : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400']"
          @click="form.level = form.level === l.value ? undefined : l.value"
        >{{ l.label }}</button>
      </div>
    </div>

    <!-- Styles de ride ───────────────────────────────────────────────────────── -->
    <div>
      <p :class="[s.label, s.mb, 'font-semibold text-mountain-800 dark:text-snow-100']">Styles de ride</p>
      <div :class="['flex flex-wrap', s.gap]">
        <button
          v-for="rs in RIDE_STYLES" :key="rs.value" type="button"
          :class="[s.btn, 'rounded-full border transition-colors',
            form.rideStyles.includes(rs.value)
              ? 'bg-ice-500 border-ice-500 text-white'
              : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400']"
          @click="toggleItem(form.rideStyles, rs.value)"
        >{{ rs.label }}</button>
      </div>
    </div>

    <!-- Niveau freestyle ────────────────────────────────────────────────────── -->
    <div v-if="hasFreestyle">
      <p :class="[s.label, s.mb, 'font-semibold text-mountain-800 dark:text-snow-100']">Niveau freestyle</p>
      <div :class="['flex flex-wrap', s.gap]">
        <button
          v-for="fl in FREESTYLE_LEVELS" :key="fl.value" type="button"
          :class="[s.btn, 'rounded-full border transition-colors',
            form.freestyleLevel === fl.value
              ? 'bg-ice-500 border-ice-500 text-white'
              : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400']"
          @click="form.freestyleLevel = form.freestyleLevel === fl.value ? undefined : fl.value"
        >{{ fl.label }}</button>
      </div>
    </div>

    <!-- Préférence neige ─────────────────────────────────────────────────────── -->
    <div>
      <p :class="[s.label, s.mb, 'font-semibold text-mountain-800 dark:text-snow-100']">Préférence neige</p>
      <div :class="['flex flex-wrap', s.gap]">
        <button
          v-for="sp in SNOW_PREFERENCES" :key="sp.value" type="button"
          :class="[s.btn, 'rounded-full border transition-colors',
            form.snowPreference === sp.value
              ? 'bg-ice-500 border-ice-500 text-white'
              : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400']"
          @click="form.snowPreference = form.snowPreference === sp.value ? undefined : sp.value"
        >{{ sp.label }}</button>
      </div>
    </div>

    <!-- Régions ─────────────────────────────────────────────────────────────── -->
    <div>
      <p :class="[s.label, s.mb, 'font-semibold text-mountain-800 dark:text-snow-100']">Régions préférées</p>
      <div :class="['flex flex-wrap', s.gap]">
        <button
          v-for="r in REGIONS" :key="r.value" type="button"
          :class="[s.btn, 'rounded-full border transition-colors',
            form.regions.includes(r.value)
              ? 'bg-ice-500 border-ice-500 text-white'
              : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400']"
          @click="toggleItem(form.regions, r.value)"
        >{{ r.label }}</button>
      </div>
    </div>

    <!-- Budget ───────────────────────────────────────────────────────────────── -->
    <div>
      <p :class="[s.label, s.mb, 'font-semibold text-mountain-800 dark:text-snow-100']">Budget</p>
      <div :class="['flex flex-wrap', s.gap]">
        <button
          v-for="b in BUDGET_RANGES" :key="b.value" type="button"
          :class="[s.btn, 'rounded-full border transition-colors',
            form.budgetRange === b.value
              ? 'bg-ice-500 border-ice-500 text-white'
              : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400']"
          @click="form.budgetRange = form.budgetRange === b.value ? undefined : b.value"
        >{{ b.label }}</button>
      </div>
    </div>

    <!-- Hors-piste ───────────────────────────────────────────────────────────── -->
    <div>
      <p :class="[s.label, 'mb-0.5 font-semibold text-mountain-800 dark:text-snow-100']">Hors-piste</p>
      <p :class="[compact ? 'text-[10px]' : 'text-xs', s.mb, 'text-muted']">Je skie / ride hors des pistes balisées</p>
      <div :class="['flex', s.gap]">
        <button
          v-for="opt in BOOLEAN_OPTIONS" :key="String(opt.value)" type="button"
          :class="[s.btn, 'rounded-full border transition-colors',
            form.offPiste === opt.value
              ? 'bg-ice-500 border-ice-500 text-white'
              : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400']"
          @click="form.offPiste = opt.value"
        >{{ opt.label }}</button>
      </div>
    </div>

    <!-- Avec enfants ─────────────────────────────────────────────────────────── -->
    <div>
      <p :class="[s.label, 'mb-0.5 font-semibold text-mountain-800 dark:text-snow-100']">Avec enfants</p>
      <p :class="[compact ? 'text-[10px]' : 'text-xs', s.mb, 'text-muted']">Je voyage avec des enfants</p>
      <div :class="['flex', s.gap]">
        <button
          v-for="opt in BOOLEAN_OPTIONS" :key="String(opt.value)" type="button"
          :class="[s.btn, 'rounded-full border transition-colors',
            form.withChildren === opt.value
              ? 'bg-ice-500 border-ice-500 text-white'
              : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400']"
          @click="form.withChildren = opt.value"
        >{{ opt.label }}</button>
      </div>
    </div>

    <!-- Feedback ─────────────────────────────────────────────────────────────── -->
    <UAlert v-if="error" color="error" variant="soft" icon="i-lucide-alert-triangle" :description="error" />
    <UAlert
      v-if="success"
      color="success"
      variant="soft"
      icon="i-lucide-check-circle"
      :description="compact
        ? 'Profil sauvegardé.'
        : 'Profil sauvegardé — l\'agent utilisera ces informations lors des prochaines conversations.'"
    />

    <UButton
      type="submit"
      color="primary"
      block
      icon="i-lucide-save"
      :loading="saving"
      :disabled="form.disciplines.length === 0"
    >
      {{ compact ? 'Sauvegarder' : 'Sauvegarder le profil' }}
    </UButton>

  </form>
</template>
