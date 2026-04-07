<script setup lang="ts">
import { CONDITIONS } from '@/constants/conditions';

definePageMeta({ layout: 'default', middleware: 'auth' });

const {
  loading,
  error,
  loadData,
  seasonLabel,
  seasonTotalSessions,
  seasonUniqueStations,
  seasonVerticalDrop,
  lastSession,
  recentSessions,
  upcomingTrips,
  userName,
} = useDashboard();

onMounted(loadData);

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const formatDateShort = (date: string) =>
  new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

const formatCondition = (key: string) => {
  const c = CONDITIONS[key as keyof typeof CONDITIONS];
  return c ? `${c.emoji} ${c.label}` : key;
};

const ratingStars = (rating: number) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

const formatVerticalDrop = (meters: number) => {
  if (meters === 0) return '—';
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${meters} m`;
};

const tripStatusColor = (status: string) => {
  if (status === 'confirmed') return 'success';
  if (status === 'cancelled') return 'error';
  return 'primary';
};

const tripStatusLabel = (status: string) => {
  if (status === 'confirmed') return 'Confirmé';
  if (status === 'cancelled') return 'Annulé';
  return 'Planifié';
};
</script>

<template>
  <div class="page-container">

    <!-- ── Loader ─────────────────────────────────────────────────────── -->
    <AppLoader v-if="loading" size="lg" label="Chargement du tableau de bord..." />

    <!-- ── Erreur ─────────────────────────────────────────────────────── -->
    <UAlert v-else-if="error" color="error" variant="soft" icon="i-lucide-alert-circle" :title="error" class="mb-6" />

    <!-- ── Contenu ────────────────────────────────────────────────────── -->
    <template v-else>

      <!-- Salutation -->
      <div class="mb-6">
        <h1 class="heading-page flex items-center gap-3 mb-1">
          <UIcon name="i-lucide-mountain-snow" class="text-ice-500" />
          Bonjour, {{ userName }} 👋
        </h1>
        <p class="text-muted">Ton tableau de bord Snow Companion</p>
      </div>

      <!-- ── Prochains trips ────────────────────────────────────────── -->
      <UCard v-if="upcomingTrips.length > 0" class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="heading-card">
              <UIcon name="i-lucide-calendar" class="text-ice-500" />
              Prochains trips
            </h2>
            <UButton to="/trips" color="neutral" variant="ghost" trailing-icon="i-lucide-arrow-right" size="sm">
              Voir tout
            </UButton>
          </div>
        </template>

        <div class="divide-y divide-mountain-100 dark:divide-mountain-700">
          <div
            v-for="trip in upcomingTrips"
            :key="trip.id"
            class="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
          >
            <div class="w-9 h-9 rounded-lg bg-ice-50 dark:bg-ice-900/30 flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-map-pin" class="text-lg text-ice-500" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-mountain-900 dark:text-snow-50 truncate">{{ trip.name }}</p>
              <p class="text-xs text-muted truncate">{{ trip.station.name }}</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-sm font-medium text-mountain-900 dark:text-snow-50">{{ formatDateShort(trip.startDate) }}</p>
              <UBadge :color="tripStatusColor(trip.status)" variant="soft" size="xs">
                {{ tripStatusLabel(trip.status) }}
              </UBadge>
            </div>
          </div>
        </div>
      </UCard>

      <!-- CTA si aucun trip planifié -->
      <div v-else class="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-mountain-300 dark:border-mountain-600">
        <UIcon name="i-lucide-calendar-plus" class="text-xl text-mountain-400 shrink-0" />
        <p class="text-sm text-muted flex-1">Aucun trip planifié.</p>
        <UButton to="/trips" color="neutral" variant="ghost" size="xs" trailing-icon="i-lucide-arrow-right">
          Planifier
        </UButton>
      </div>

      <!-- ── Stats saison ───────────────────────────────────────────── -->
      <div class="mb-6">
        <p class="text-label uppercase tracking-wide mb-3">Saison {{ seasonLabel }}</p>
        <div class="grid grid-cols-3 gap-3">

          <UCard class="text-center">
            <div class="py-1">
              <UIcon name="i-lucide-bar-chart-2" class="text-2xl text-ice-500 mb-1" />
              <p class="text-2xl font-bold text-mountain-900 dark:text-snow-50">{{ seasonTotalSessions }}</p>
              <p class="text-muted text-xs mt-0.5">Sessions</p>
            </div>
          </UCard>

          <UCard class="text-center">
            <div class="py-1">
              <UIcon name="i-lucide-map-pin" class="text-2xl text-forest-500 mb-1" />
              <p class="text-2xl font-bold text-mountain-900 dark:text-snow-50">{{ seasonUniqueStations }}</p>
              <p class="text-muted text-xs mt-0.5">Stations</p>
            </div>
          </UCard>

          <UCard class="text-center">
            <div class="py-1">
              <UIcon name="i-lucide-trending-down" class="text-2xl text-powder-500 mb-1" />
              <p class="text-2xl font-bold text-mountain-900 dark:text-snow-50">{{ formatVerticalDrop(seasonVerticalDrop) }}</p>
              <p class="text-muted text-xs mt-0.5">Dénivelé</p>
            </div>
          </UCard>

        </div>
      </div>

      <!-- ── Dernière session ───────────────────────────────────────── -->
      <div
        v-if="lastSession"
        class="flex items-center gap-4 px-4 py-3 rounded-xl bg-ice-50 dark:bg-ice-900/20 border border-ice-200 dark:border-ice-800/50 mb-6"
      >
        <UIcon name="i-lucide-history" class="text-xl text-ice-500 shrink-0" />
        <div class="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
          <span class="text-sm text-mountain-600 dark:text-mountain-400">Dernière session :</span>
          <span class="font-semibold text-mountain-900 dark:text-snow-50">{{ lastSession.station }}</span>
          <span class="text-mountain-400 dark:text-mountain-500 hidden sm:inline">·</span>
          <span class="text-sm text-muted">{{ formatDate(lastSession.date) }}</span>
          <UBadge v-if="lastSession.conditions" color="primary" variant="soft" size="sm" class="hidden md:inline-flex">
            {{ formatCondition(lastSession.conditions) }}
          </UBadge>
          <span v-if="lastSession.rating" class="text-sm text-powder-500 dark:text-powder-400 hidden sm:inline">
            {{ ratingStars(lastSession.rating) }}
          </span>
        </div>
        <UButton to="/tracking" color="neutral" variant="ghost" size="xs" trailing-icon="i-lucide-arrow-right" class="shrink-0">
          Voir
        </UButton>
      </div>

      <!-- ── Sessions récentes ──────────────────────────────────────── -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="heading-card">
              <UIcon name="i-lucide-clock" class="text-ice-500" />
              Sessions récentes
            </h2>
            <UButton to="/tracking" color="neutral" variant="ghost" trailing-icon="i-lucide-arrow-right" size="sm">
              Voir tout
            </UButton>
          </div>
        </template>

        <div v-if="!recentSessions.length" class="text-center py-10">
          <UIcon name="i-lucide-snowflake" class="text-5xl text-mountain-300 mx-auto mb-3" />
          <p class="text-muted mb-4">Aucune session pour le moment.</p>
          <UButton to="/sessions/add-session" color="primary" icon="i-lucide-plus">
            Ajouter ma première session
          </UButton>
        </div>

        <div v-else class="divide-y divide-mountain-100 dark:divide-mountain-700">
          <div
            v-for="session in recentSessions"
            :key="session.id"
            class="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
          >
            <div class="w-9 h-9 rounded-lg bg-ice-50 dark:bg-ice-900/30 flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-mountain" class="text-lg text-ice-500" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-mountain-900 dark:text-snow-50 truncate">{{ session.station }}</p>
              <p class="text-xs text-muted">{{ formatDate(session.date) }}</p>
            </div>
            <UBadge v-if="session.conditions" color="primary" variant="soft" size="sm" class="hidden sm:flex shrink-0">
              {{ formatCondition(session.conditions) }}
            </UBadge>
            <span
              v-if="session.rating"
              class="text-sm text-powder-500 dark:text-powder-400 shrink-0 tabular-nums"
              :title="`Note : ${session.rating}/5`"
            >
              {{ ratingStars(session.rating) }}
            </span>
          </div>
        </div>
      </UCard>

    </template>
  </div>
</template>
