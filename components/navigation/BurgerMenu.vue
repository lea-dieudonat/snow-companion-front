<script setup lang="ts">
import type { UpsertProfilePayload } from '@/composables/useProfile';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{ close: [] }>();

const userStore = useUserStore();
const sessionsStore = useSessionsStore();
const favoritesStore = useFavoritesStore();
const { profile, loading: loadingProfile, saving, error: profileError, load: loadProfile, save } = useProfile();
const router = useRouter();

// Load data on first open
const loaded = ref(false);
watch(() => props.isOpen, async (val) => {
  if (val && !loaded.value) {
    loaded.value = true;
    await Promise.all([sessionsStore.load(), favoritesStore.load(), loadProfile()]);
  }
});

// ── Stats ─────────────────────────────────────────────────────────────────────
const stats = computed(() => {
  const s = sessionsStore.sessions;
  const rated = s.filter(s => s.rating != null);
  return {
    total: s.length,
    uniqueStations: new Set(s.map(s => s.station)).size,
    avgRating: rated.length
      ? Math.round(s.reduce((acc, s) => acc + (s.rating ?? 0), 0) / rated.length * 10) / 10
      : null,
    favorites: favoritesStore.stations.length,
  };
});

const initials = computed(() => {
  const name = userStore.currentUser?.name;
  if (name) return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  return userStore.currentUser?.email?.[0]?.toUpperCase() ?? '?';
});

// ── Profil rider ──────────────────────────────────────────────────────────────
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

const primaryDisciplineOptions = computed(() =>
  DISCIPLINES.filter(d => form.disciplines.includes(d.value))
);
watch(() => form.disciplines, (disciplines) => {
  if (form.primaryDiscipline && !disciplines.includes(form.primaryDiscipline)) {
    form.primaryDiscipline = disciplines[0];
  }
});

const hasFreestyle = computed(() => form.rideStyles.includes('freestyle'));

const profileExpanded = ref(true);

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

// ── Compte ────────────────────────────────────────────────────────────────────
const handleLogout = () => {
  userStore.logout();
  emit('close');
  router.push('/login');
};
</script>

<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 bg-mountain-900/50 z-200" @click="emit('close')" />
  </Transition>

  <!-- Panel -->
  <Transition name="slide">
    <div
      v-if="isOpen"
      class="fixed top-0 right-0 bottom-0 w-[min(92vw,440px)] bg-snow-50 dark:bg-mountain-900 z-300 shadow-[-2px_0_10px_rgba(0,0,0,0.15)] flex flex-col"
    >
      <!-- Close button -->
      <div class="flex justify-end p-3 shrink-0">
        <UButton icon="i-lucide-x" variant="ghost" color="neutral" size="lg" aria-label="Fermer" @click="emit('close')" />
      </div>

      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto px-4 pb-4 space-y-4">

        <!-- Identité -->
        <div class="flex items-center gap-3">
          <div class="w-14 h-14 rounded-2xl bg-ice-100 dark:bg-ice-900/40 flex items-center justify-center shrink-0">
            <span class="text-xl font-bold text-ice-600 dark:text-ice-400">{{ initials }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-lg font-bold text-mountain-900 dark:text-snow-50 truncate">
              {{ userStore.currentUser?.name ?? 'Rider anonyme' }}
            </p>
            <p class="text-xs text-muted truncate">{{ userStore.currentUser?.email }}</p>
          </div>
          <UBadge color="primary" variant="soft" icon="i-lucide-snowflake" size="xs">Rider</UBadge>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-4 gap-2">
          <div class="info-box text-center py-2">
            <p class="text-xl font-bold text-mountain-900 dark:text-snow-50">{{ stats.total }}</p>
            <p class="text-[10px] text-muted mt-0.5 leading-tight">Sessions</p>
          </div>
          <div class="info-box text-center py-2">
            <p class="text-xl font-bold text-mountain-900 dark:text-snow-50">{{ stats.uniqueStations }}</p>
            <p class="text-[10px] text-muted mt-0.5 leading-tight">Stations</p>
          </div>
          <div class="info-box text-center py-2">
            <p class="text-xl font-bold text-mountain-900 dark:text-snow-50">{{ stats.avgRating ?? '—' }}</p>
            <p class="text-[10px] text-muted mt-0.5 leading-tight">Note moy.</p>
          </div>
          <div class="info-box text-center py-2">
            <p class="text-xl font-bold text-mountain-900 dark:text-snow-50">{{ stats.favorites }}</p>
            <p class="text-[10px] text-muted mt-0.5 leading-tight">Favoris</p>
          </div>
        </div>

        <!-- Profil rider -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="heading-card text-sm">
                <UIcon name="i-lucide-user-circle" class="text-ice-500" />
                Profil rider
              </h2>
              <UButton
                :icon="profileExpanded ? 'i-lucide-minus' : 'i-lucide-plus'"
                variant="ghost"
                color="neutral"
                size="xs"
                @click="profileExpanded = !profileExpanded"
              />
            </div>
          </template>

          <template v-if="profileExpanded">
          <AppLoader v-if="loadingProfile" />

          <form v-else class="space-y-4" @submit.prevent="handleSubmit">

            <!-- Disciplines -->
            <div>
              <p class="text-xs font-semibold text-mountain-800 dark:text-snow-100 mb-1.5">
                Disciplines <span class="text-error-500">*</span>
              </p>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="d in DISCIPLINES" :key="d.value" type="button"
                  class="px-2.5 py-1 rounded-full text-xs border transition-colors"
                  :class="form.disciplines.includes(d.value)
                    ? 'bg-ice-500 border-ice-500 text-white'
                    : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400'"
                  @click="toggleItem(form.disciplines, d.value)"
                >{{ d.label }}</button>
              </div>
            </div>

            <!-- Discipline principale -->
            <div v-if="primaryDisciplineOptions.length > 1">
              <p class="text-xs font-semibold text-mountain-800 dark:text-snow-100 mb-1.5">Discipline principale</p>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="d in primaryDisciplineOptions" :key="d.value" type="button"
                  class="px-2.5 py-1 rounded-full text-xs border transition-colors"
                  :class="form.primaryDiscipline === d.value
                    ? 'bg-forest-500 border-forest-500 text-white'
                    : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-forest-400'"
                  @click="form.primaryDiscipline = d.value"
                >{{ d.label }}</button>
              </div>
            </div>

            <!-- Niveau -->
            <div>
              <p class="text-xs font-semibold text-mountain-800 dark:text-snow-100 mb-1.5">Niveau</p>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="l in LEVELS" :key="l.value" type="button"
                  class="px-2.5 py-1 rounded-full text-xs border transition-colors"
                  :class="form.level === l.value
                    ? 'bg-ice-500 border-ice-500 text-white'
                    : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400'"
                  @click="form.level = form.level === l.value ? undefined : l.value"
                >{{ l.label }}</button>
              </div>
            </div>

            <!-- Styles de ride -->
            <div>
              <p class="text-xs font-semibold text-mountain-800 dark:text-snow-100 mb-1.5">Styles de ride</p>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="s in RIDE_STYLES" :key="s.value" type="button"
                  class="px-2.5 py-1 rounded-full text-xs border transition-colors"
                  :class="form.rideStyles.includes(s.value)
                    ? 'bg-ice-500 border-ice-500 text-white'
                    : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400'"
                  @click="toggleItem(form.rideStyles, s.value)"
                >{{ s.label }}</button>
              </div>
            </div>

            <!-- Niveau freestyle -->
            <div v-if="hasFreestyle">
              <p class="text-xs font-semibold text-mountain-800 dark:text-snow-100 mb-1.5">Niveau freestyle</p>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="fl in FREESTYLE_LEVELS" :key="fl.value" type="button"
                  class="px-2.5 py-1 rounded-full text-xs border transition-colors"
                  :class="form.freestyleLevel === fl.value
                    ? 'bg-ice-500 border-ice-500 text-white'
                    : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400'"
                  @click="form.freestyleLevel = form.freestyleLevel === fl.value ? undefined : fl.value"
                >{{ fl.label }}</button>
              </div>
            </div>

            <!-- Préférence neige -->
            <div>
              <p class="text-xs font-semibold text-mountain-800 dark:text-snow-100 mb-1.5">Préférence neige</p>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="sp in SNOW_PREFERENCES" :key="sp.value" type="button"
                  class="px-2.5 py-1 rounded-full text-xs border transition-colors"
                  :class="form.snowPreference === sp.value
                    ? 'bg-ice-500 border-ice-500 text-white'
                    : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400'"
                  @click="form.snowPreference = form.snowPreference === sp.value ? undefined : sp.value"
                >{{ sp.label }}</button>
              </div>
            </div>

            <!-- Régions -->
            <div>
              <p class="text-xs font-semibold text-mountain-800 dark:text-snow-100 mb-1.5">Régions préférées</p>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="r in REGIONS" :key="r.value" type="button"
                  class="px-2.5 py-1 rounded-full text-xs border transition-colors"
                  :class="form.regions.includes(r.value)
                    ? 'bg-ice-500 border-ice-500 text-white'
                    : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400'"
                  @click="toggleItem(form.regions, r.value)"
                >{{ r.label }}</button>
              </div>
            </div>

            <!-- Budget -->
            <div>
              <p class="text-xs font-semibold text-mountain-800 dark:text-snow-100 mb-1.5">Budget</p>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="b in BUDGET_RANGES" :key="b.value" type="button"
                  class="px-2.5 py-1 rounded-full text-xs border transition-colors"
                  :class="form.budgetRange === b.value
                    ? 'bg-ice-500 border-ice-500 text-white'
                    : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400'"
                  @click="form.budgetRange = form.budgetRange === b.value ? undefined : b.value"
                >{{ b.label }}</button>
              </div>
            </div>

            <!-- Hors-piste -->
            <div>
              <p class="text-xs font-semibold text-mountain-800 dark:text-snow-100 mb-0.5">Hors-piste</p>
              <p class="text-[10px] text-muted mb-1.5">Je skie / ride hors des pistes balisées</p>
              <div class="flex gap-1.5">
                <button
                  v-for="opt in ([{ label: 'Oui', value: true }, { label: 'Non', value: false }, { label: 'Non renseigné', value: null }] as const)"
                  :key="String(opt.value)" type="button"
                  class="px-2.5 py-1 rounded-full text-xs border transition-colors"
                  :class="form.offPiste === opt.value
                    ? 'bg-ice-500 border-ice-500 text-white'
                    : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400'"
                  @click="form.offPiste = opt.value"
                >{{ opt.label }}</button>
              </div>
            </div>

            <!-- Avec enfants -->
            <div>
              <p class="text-xs font-semibold text-mountain-800 dark:text-snow-100 mb-0.5">Avec enfants</p>
              <p class="text-[10px] text-muted mb-1.5">Je voyage avec des enfants</p>
              <div class="flex gap-1.5">
                <button
                  v-for="opt in ([{ label: 'Oui', value: true }, { label: 'Non', value: false }, { label: 'Non renseigné', value: null }] as const)"
                  :key="String(opt.value)" type="button"
                  class="px-2.5 py-1 rounded-full text-xs border transition-colors"
                  :class="form.withChildren === opt.value
                    ? 'bg-ice-500 border-ice-500 text-white'
                    : 'border-mountain-300 dark:border-mountain-600 text-mountain-700 dark:text-mountain-300 hover:border-ice-400'"
                  @click="form.withChildren = opt.value"
                >{{ opt.label }}</button>
              </div>
            </div>

            <!-- Feedback -->
            <UAlert v-if="profileError" color="error" variant="soft" icon="i-lucide-alert-triangle" :description="profileError" />
            <UAlert v-if="success" color="success" variant="soft" icon="i-lucide-check-circle"
              description="Profil sauvegardé." />

            <UButton type="submit" color="primary" block icon="i-lucide-save"
              :loading="saving" :disabled="form.disciplines.length === 0">
              Sauvegarder
            </UButton>
          </form>
          </template>
        </UCard>

        <!-- À propos + Déconnexion -->
        <div class="space-y-2 pb-2">
          <UDivider />
          <NuxtLink
            to="/about"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-mountain-700 dark:text-mountain-300 hover:bg-mountain-100 dark:hover:bg-mountain-800 transition-colors no-underline"
            @click="emit('close')"
          >
            <UIcon name="i-lucide-info" class="text-lg shrink-0" />
            À propos
          </NuxtLink>
          <button
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-powder-500 hover:bg-powder-50 dark:hover:bg-powder-900/20 transition-colors"
            @click="handleLogout"
          >
            <UIcon name="i-lucide-log-out" class="text-lg shrink-0" />
            Déconnexion
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
