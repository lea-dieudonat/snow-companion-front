<script setup lang="ts">
import { CONDITIONS } from '@/constants/conditions';

definePageMeta({ layout: 'default', middleware: 'auth' });

const {
  loading,
  error,
  loadData,
  totalSessions,
  averageRating,
  totalTricks,
  uniqueStations,
  favoritesCount,
  lastSession,
  topStation,
  topCondition,
  recentSessions,
  chartData,
  userName,
} = useDashboard();

onMounted(loadData);

// ── Graphique Chart.js ───────────────────────────────────────────────────────
const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: InstanceType<Window['Chart']> | null = null;

const renderChart = () => {
  if (!chartCanvas.value || !window.Chart) return;

  chartInstance?.destroy();

  const data = chartData.value;
  const isDark = document.documentElement.classList.contains('dark');
  const gridColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const labelColor = isDark ? '#94a3b8' : '#64748b';

  chartInstance = (new window.Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels: data.map(d => d.label),
      datasets: [{
        label: 'Sessions',
        data: data.map(d => d.count),
        backgroundColor: isDark
          ? 'rgba(147, 197, 253, 0.5)'
          : 'rgba(59, 130, 246, 0.55)',
        borderColor: isDark
          ? 'rgba(147, 197, 253, 0.9)'
          : 'rgba(59, 130, 246, 0.9)',
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: { parsed: { y: number } }) => {
              const v = ctx.parsed.y;
              return ` ${v} session${v > 1 ? 's' : ''}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: {
            color: labelColor,
            font: { size: 11 },
            maxRotation: 45,
            autoSkip: false,
          },
        },
        y: {
          beginAtZero: true,
          grid: { color: gridColor },
          ticks: {
            color: labelColor,
            stepSize: 1,
            precision: 0,
          },
        },
      },
    },
  }) as InstanceType<Window['Chart']>);
};

watch([chartData, loading], ([, isLoading]) => {
  if (!isLoading) {
    nextTick(() => {
      if (typeof window !== 'undefined' && !(window as unknown as { Chart?: unknown }).Chart) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
        script.onload = renderChart;
        document.head.appendChild(script);
      } else {
        renderChart();
      }
    });
  }
});

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const formatCondition = (key: string) => {
  const c = CONDITIONS[key as keyof typeof CONDITIONS];
  return c ? `${c.emoji} ${c.label}` : key;
};

const ratingStars = (rating: number) => '★'.repeat(rating) + '☆'.repeat(5 - rating);
</script>

<template>
  <div class="page-container">

    <!-- ── Loader ─────────────────────────────────────────────────────── -->
    <AppLoader v-if="loading" size="lg" label="Chargement du tableau de bord..." />

    <!-- ── Erreur ─────────────────────────────────────────────────────── -->
    <UAlert v-else-if="error" color="error" variant="soft" icon="i-lucide-alert-circle" :title="error" class="mb-6" />

    <!-- ── Contenu ────────────────────────────────────────────────────── -->
    <template v-else>

      <!-- Hero / salutation -->
      <div class="mb-8">
        <div class="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <h1 class="heading-page flex items-center gap-3 mb-2">
              <UIcon name="i-lucide-mountain-snow" class="text-ice-500" />
              Bonjour, {{ userName }} 👋
            </h1>
            <p class="text-muted text-lg">
              Ton tableau de bord Snow Companion
            </p>
          </div>
          <UButton to="/sessions/add-session" color="primary" icon="i-lucide-plus" size="lg">
            Nouvelle session
          </UButton>
        </div>

        <!-- Bannière dernière session -->
        <div v-if="lastSession"
          class="flex items-center gap-4 px-4 py-3 rounded-xl bg-ice-50 dark:bg-ice-900/20 border border-ice-200 dark:border-ice-800/50">
          <UIcon name="i-lucide-history" class="text-xl text-ice-500 shrink-0" />
          <div class="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
            <span class="text-sm text-mountain-600 dark:text-mountain-400">Dernière session :</span>
            <span class="font-semibold text-mountain-900 dark:text-snow-50">{{ lastSession.station }}</span>
            <span class="text-mountain-400 dark:text-mountain-500 hidden sm:inline">·</span>
            <span class="text-sm text-muted">{{ formatDate(lastSession.date) }}</span>
            <UBadge v-if="lastSession.conditions" color="primary" variant="soft" size="sm"
              class="hidden md:inline-flex">
              {{ formatCondition(lastSession.conditions) }}
            </UBadge>
            <span v-if="lastSession.rating" class="text-sm text-powder-500 dark:text-powder-400 hidden sm:inline">{{
              ratingStars(lastSession.rating) }}</span>
          </div>
          <UButton to="/tracking" color="neutral" variant="ghost" size="xs" trailing-icon="i-lucide-arrow-right"
            class="shrink-0">
            Voir
          </UButton>
        </div>
      </div>

      <!-- ── Métriques principales ────────────────────────────────── -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        <!-- Total sessions -->
        <UCard class="text-center">
          <div class="py-2">
            <UIcon name="i-lucide-bar-chart-3" class="text-3xl text-ice-500 mb-2" />
            <p class="text-3xl font-bold text-mountain-900 dark:text-snow-50">
              {{ totalSessions }}
            </p>
            <p class="text-muted text-sm mt-1">Sessions</p>
          </div>
        </UCard>

        <!-- Stations visitées -->
        <UCard class="text-center">
          <div class="py-2">
            <UIcon name="i-lucide-map-pin" class="text-3xl text-forest-500 mb-2" />
            <p class="text-3xl font-bold text-mountain-900 dark:text-snow-50">
              {{ uniqueStations }}
            </p>
            <p class="text-muted text-sm mt-1">Stations</p>
          </div>
        </UCard>

        <!-- Note moyenne -->
        <UCard class="text-center">
          <div class="py-2">
            <UIcon name="i-lucide-star" class="text-3xl text-powder-500 mb-2" />
            <p class="text-3xl font-bold text-mountain-900 dark:text-snow-50">
              {{ averageRating ?? '—' }}
            </p>
            <p class="text-muted text-sm mt-1">Note moy.</p>
          </div>
        </UCard>

        <!-- Tricks -->
        <UCard class="text-center">
          <div class="py-2">
            <UIcon name="i-lucide-sparkles" class="text-3xl text-powder-400 mb-2" />
            <p class="text-3xl font-bold text-mountain-900 dark:text-snow-50">
              {{ totalTricks }}
            </p>
            <p class="text-muted text-sm mt-1">Tricks loggés</p>
          </div>
        </UCard>

      </div>

      <!-- ── Contenu principal : graphique + infos ─────────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        <!-- Graphique mensuel (2/3) -->
        <UCard class="lg:col-span-2">
          <template #header>
            <h2 class="heading-card">
              <UIcon name="i-lucide-trending-up" class="text-ice-500" />
              Activité (12 derniers mois)
            </h2>
          </template>

          <div v-if="totalSessions === 0" class="flex flex-col items-center justify-center py-12 text-center">
            <UIcon name="i-lucide-snowflake" class="text-5xl text-mountain-300 mb-3" />
            <p class="text-muted">Aucune session pour le moment.</p>
            <UButton to="/sessions/add-session" color="primary" variant="soft" size="sm" class="mt-4"
              icon="i-lucide-plus">
              Ajouter ma première session
            </UButton>
          </div>

          <div v-else style="position: relative; height: 260px;">
            <canvas ref="chartCanvas" />
          </div>
        </UCard>

        <!-- Carte infos rapides (1/3) -->
        <div class="space-y-4">

          <!-- Station favorite -->
          <UCard>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-ice-100 dark:bg-ice-800/40 flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-trophy" class="text-xl text-ice-600 dark:text-ice-400" />
              </div>
              <div class="min-w-0">
                <p class="text-label uppercase tracking-wide">Station préférée</p>
                <p v-if="topStation" class="font-semibold text-mountain-900 dark:text-snow-50 truncate">
                  {{ topStation.name }}
                </p>
                <p v-else class="text-muted text-sm">—</p>
                <p v-if="topStation" class="text-xs text-muted">{{ topStation.count }} visite{{ topStation.count > 1 ?
                  's' : ''
                }}</p>
              </div>
            </div>
          </UCard>

          <!-- Conditions favorites -->
          <UCard>
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-powder-100 dark:bg-powder-900/40 flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-cloud-snow" class="text-xl text-powder-600 dark:text-powder-400" />
              </div>
              <div>
                <p class="text-label uppercase tracking-wide">Conditions fav.</p>
                <p class="font-semibold text-mountain-900 dark:text-snow-50">
                  {{ topCondition ?? '—' }}
                </p>
              </div>
            </div>
          </UCard>

          <!-- Stations favorites -->
          <UCard>
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-forest-100 dark:bg-forest-800/40 flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-heart" class="text-xl text-forest-600 dark:text-forest-400" />
              </div>
              <div>
                <p class="text-label uppercase tracking-wide">Favoris</p>
                <p class="font-semibold text-mountain-900 dark:text-snow-50">
                  {{ favoritesCount }} station{{ favoritesCount > 1 ? 's' : '' }}
                </p>
              </div>
            </div>
          </UCard>

        </div>
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

        <!-- Vide -->
        <div v-if="!recentSessions.length" class="text-center py-10">
          <UIcon name="i-lucide-snowflake" class="text-5xl text-mountain-300 mx-auto mb-3" />
          <p class="text-muted mb-4">Aucune session pour le moment.</p>
          <UButton to="/sessions/add-session" color="primary" icon="i-lucide-plus">
            Ajouter ma première session
          </UButton>
        </div>

        <!-- Liste -->
        <div v-else class="divide-y divide-mountain-100 dark:divide-mountain-700">
          <div v-for="session in recentSessions" :key="session.id"
            class="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
            <!-- Icône station -->
            <div class="w-9 h-9 rounded-lg bg-ice-50 dark:bg-ice-900/30 flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-mountain" class="text-lg text-ice-500" />
            </div>

            <!-- Info principale -->
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-mountain-900 dark:text-snow-50 truncate">
                {{ session.station }}
              </p>
              <p class="text-xs text-muted">{{ formatDate(session.date) }}</p>
            </div>

            <!-- Conditions badge -->
            <UBadge v-if="session.conditions" color="primary" variant="soft" size="sm" class="hidden sm:flex shrink-0">
              {{ formatCondition(session.conditions) }}
            </UBadge>

            <!-- Rating étoiles -->
            <span v-if="session.rating" class="text-sm text-powder-500 dark:text-powder-400 shrink-0 tabular-nums"
              :title="`Note : ${session.rating}/5`">
              {{ ratingStars(session.rating) }}
            </span>
          </div>
        </div>
      </UCard>

    </template>
  </div>
</template>