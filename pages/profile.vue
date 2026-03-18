<script setup lang="ts">
import type { UpsertProfilePayload } from '@/composables/useProfile';

definePageMeta({ layout: 'default', middleware: 'auth' });

const userStore = useUserStore();
const sessionsStore = useSessionsStore();
const favoritesStore = useFavoritesStore();
const { profile, loading: loadingProfile, saving, error: profileError, load: loadProfile, save } = useProfile();

onMounted(async () => {
  await Promise.all([sessionsStore.load(), favoritesStore.load(), loadProfile()]);
});

// ── Stats ────────────────────────────────────────────────────────────────────
const stats = computed(() => {
  const s = sessionsStore.sessions;
  const rated = s.filter(s => s.rating != null);
  return {
    total: s.length,
    uniqueStations: new Set(s.map(s => s.station)).size,
    avgRating: rated.length
      ? Math.round(s.reduce((acc, s) => acc + (s.rating ?? 0), 0) / rated.length * 10) / 10
      : null,
    totalTricks: s.reduce((acc, s) => acc + (s.tricks?.length ?? 0), 0),
    totalRuns: s.reduce((acc, s) => acc + (s.runCount ?? 0), 0),
    maxSpeed: s.reduce((acc, s) => Math.max(acc, s.maxSpeed ?? 0), 0),
    totalVertical: s.reduce((acc, s) => acc + (s.verticalDrop ?? 0), 0),
    favorites: favoritesStore.stations.length,
  };
});

const initials = computed(() => {
  const name = userStore.currentUser?.name;
  if (name) return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  return userStore.currentUser?.email?.[0]?.toUpperCase() ?? '?';
});

const handleLogout = () => {
  userStore.logout();
  navigateTo('/login');
};

// ── Formulaire ───────────────────────────────────────────────────────────────
const success = ref(false);
const handleSubmit = async (payload: UpsertProfilePayload) => {
  success.value = false;
  const ok = await save(payload);
  if (ok) success.value = true;
};
</script>

<template>
  <div class="page-container-sm">
    <AppPageHeader title="Mon profil" icon="i-lucide-user" />

    <!-- ── Identité ─────────────────────────────────────────────────────── -->
    <UCard class="mb-6">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-2xl bg-ice-100 dark:bg-ice-900/40 flex items-center justify-center shrink-0">
          <span class="text-2xl font-bold text-ice-600 dark:text-ice-400">{{ initials }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xl font-bold text-mountain-900 dark:text-snow-50 truncate">
            {{ userStore.currentUser?.name ?? 'Rider anonyme' }}
          </p>
          <p class="text-sm text-muted truncate">{{ userStore.currentUser?.email }}</p>
        </div>
        <UBadge color="primary" variant="soft" icon="i-lucide-snowflake">
          Rider
        </UBadge>
      </div>
    </UCard>

    <!-- ── Stats saison ──────────────────────────────────────────────────── -->
    <UCard class="mb-6">
      <template #header>
        <h2 class="heading-card">
          <UIcon name="i-lucide-bar-chart-3" class="text-ice-500" />
          Statistiques
        </h2>
      </template>
      <div class="grid grid-cols-2 gap-3">
        <div class="info-box text-center py-3">
          <p class="text-2xl font-bold text-mountain-900 dark:text-snow-50">{{ stats.total }}</p>
          <p class="text-xs text-muted mt-0.5">Sessions</p>
        </div>
        <div class="info-box text-center py-3">
          <p class="text-2xl font-bold text-mountain-900 dark:text-snow-50">{{ stats.uniqueStations }}</p>
          <p class="text-xs text-muted mt-0.5">Stations visitées</p>
        </div>
        <div class="info-box text-center py-3">
          <p class="text-2xl font-bold text-mountain-900 dark:text-snow-50">
            {{ stats.avgRating ?? '—' }}
            <span v-if="stats.avgRating" class="text-sm font-normal text-muted">/5</span>
          </p>
          <p class="text-xs text-muted mt-0.5">Note moyenne</p>
        </div>
        <div class="info-box text-center py-3">
          <p class="text-2xl font-bold text-mountain-900 dark:text-snow-50">{{ stats.totalTricks }}</p>
          <p class="text-xs text-muted mt-0.5">Tricks loggés</p>
        </div>
        <div class="info-box text-center py-3">
          <p class="text-2xl font-bold text-mountain-900 dark:text-snow-50">
            {{ stats.totalRuns > 0 ? stats.totalRuns : '—' }}
          </p>
          <p class="text-xs text-muted mt-0.5">Descentes totales</p>
        </div>
        <div class="info-box text-center py-3">
          <p class="text-2xl font-bold text-mountain-900 dark:text-snow-50">
            {{ stats.maxSpeed > 0 ? stats.maxSpeed : '—' }}
            <span v-if="stats.maxSpeed > 0" class="text-sm font-normal text-muted">km/h</span>
          </p>
          <p class="text-xs text-muted mt-0.5">Vitesse max</p>
        </div>
        <div class="info-box text-center py-3">
          <p class="text-2xl font-bold text-mountain-900 dark:text-snow-50">
            {{ stats.totalVertical > 0 ? stats.totalVertical.toLocaleString('fr-FR') : '—' }}
            <span v-if="stats.totalVertical > 0" class="text-sm font-normal text-muted">m</span>
          </p>
          <p class="text-xs text-muted mt-0.5">Dénivelé cumulé</p>
        </div>
        <div class="info-box text-center py-3">
          <p class="text-2xl font-bold text-mountain-900 dark:text-snow-50">{{ stats.favorites }}</p>
          <p class="text-xs text-muted mt-0.5">Stations favorites</p>
        </div>
      </div>
    </UCard>

    <!-- ── Profil rider ──────────────────────────────────────────────────── -->
    <UCard class="mb-6">
      <template #header>
        <h2 class="heading-card">
          <UIcon name="i-lucide-user-circle" class="text-ice-500" />
          Profil rider
        </h2>
      </template>
      <ProfileRiderForm
        :profile="profile"
        :loading="loadingProfile"
        :saving="saving"
        :error="profileError"
        :success="success"
        @submit="handleSubmit"
      />
    </UCard>

    <!-- ── Compte ────────────────────────────────────────────────────────── -->
    <UCard>
      <template #header>
        <h2 class="heading-card">
          <UIcon name="i-lucide-settings" class="text-mountain-400" />
          Compte
        </h2>
      </template>
      <div class="space-y-2">
        <UButton color="neutral" variant="ghost" block icon="i-lucide-bar-chart-3"
          trailing-icon="i-lucide-arrow-right" to="/tracking" class="justify-between">
          Voir mes sessions
        </UButton>
        <UButton color="neutral" variant="ghost" block icon="i-lucide-map"
          trailing-icon="i-lucide-arrow-right" to="/trips" class="justify-between">
          Voir mes trips
        </UButton>
        <UDivider class="my-2" />
        <UButton color="error" variant="soft" block icon="i-lucide-log-out" @click="handleLogout">
          Déconnexion
        </UButton>
      </div>
    </UCard>
  </div>
</template>
