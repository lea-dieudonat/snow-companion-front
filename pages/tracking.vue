<script setup lang="ts">
import { Chart, registerables } from 'chart.js';
import type { Session } from '@/types/session.types';
import { CONDITIONS } from '@/constants/conditions';

Chart.register(...registerables);

definePageMeta({ layout: 'default', middleware: 'auth' });

const store = useSessionsStore();

const { data: sessions, refresh: fetchSessions } = await useAsyncData(
  'sessions',
  () => store.load().then(() => store.sessions),
  { default: () => [] as Session[] }
);

// ── Graphique ────────────────────────────────────────────────────────────────
type ChartMode = 'sessions' | 'rating';
const chartMode = ref<ChartMode>('sessions');
const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

// Génère les colonnes du graphique selon la saison sélectionnée
function getChartColumns(): { label: string; year: number; month: number }[] {
  if (!selectedSeason.value) {
    const now = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return {
        label: d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
        year: d.getFullYear(),
        month: d.getMonth(),
      };
    });
  }
  const [startYear] = selectedSeason.value.split('-').map(Number) as [number, number];
  return [11, 12, 1, 2, 3, 4].map(m => {
    const year = m >= 11 ? startYear : startYear + 1;
    const d = new Date(year, m - 1, 1);
    return {
      label: d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
      year,
      month: m - 1,
    };
  });
}

const chartDataSessions = computed(() => {
  const s = filteredSessions.value;
  return getChartColumns().map(col => ({
    label: col.label,
    value: s.filter(sess => {
      const sd = new Date(sess.date);
      return sd.getFullYear() === col.year && sd.getMonth() === col.month;
    }).length,
  }));
});

const chartDataRating = computed(() => {
  const s = filteredSessions.value;
  return getChartColumns().map(col => {
    const monthSessions = s.filter(sess => {
      const sd = new Date(sess.date);
      return sd.getFullYear() === col.year && sd.getMonth() === col.month && sess.rating != null;
    });
    const avg = monthSessions.length
      ? Math.round((monthSessions.reduce((acc, sess) => acc + (sess.rating ?? 0), 0) / monthSessions.length) * 10) / 10
      : null;
    return { label: col.label, value: avg };
  });
});

const renderChart = () => {
  if (!chartCanvas.value) return;
  chartInstance?.destroy();

  const isDark = document.documentElement.classList.contains('dark');
  const gridColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const labelColor = isDark ? '#94a3b8' : '#64748b';

  const isRating = chartMode.value === 'rating';
  const raw = isRating ? chartDataRating.value : chartDataSessions.value;

  const barColor = isRating
    ? (isDark ? 'rgba(251, 191, 36, 0.55)' : 'rgba(245, 158, 11, 0.6)')
    : (isDark ? 'rgba(147, 197, 253, 0.5)' : 'rgba(59, 130, 246, 0.55)');
  const borderColor = isRating
    ? (isDark ? 'rgba(251, 191, 36, 0.9)' : 'rgba(245, 158, 11, 0.9)')
    : (isDark ? 'rgba(147, 197, 253, 0.9)' : 'rgba(59, 130, 246, 0.9)');

  chartInstance = new Chart(chartCanvas.value, {
    type: isRating ? 'line' : 'bar',
    data: {
      labels: raw.map(d => d.label),
      datasets: [{
        label: isRating ? 'Note moyenne' : 'Sessions',
        data: raw.map(d => d.value),
        backgroundColor: barColor,
        borderColor,
        borderWidth: isRating ? 2 : 1.5,
        borderRadius: isRating ? 0 : 6,
        borderSkipped: false,
        tension: 0.4,
        pointBackgroundColor: borderColor,
        pointRadius: isRating ? 4 : 0,
        spanGaps: true,
        fill: isRating,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const v = ctx.parsed.y;
              if (v == null) return ' Aucune donnée';
              return isRating ? ` ${v}/5` : ` ${v} session${v > 1 ? 's' : ''}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: labelColor, font: { size: 11 }, maxRotation: 45, autoSkip: false },
        },
        y: {
          beginAtZero: true,
          max: isRating ? 5 : undefined,
          grid: { color: gridColor },
          ticks: {
            color: labelColor,
            stepSize: isRating ? 1 : 1,
            precision: 0,
            callback: (v) => isRating ? `${v}/5` : (v as number),
          },
        },
      },
    },
  }) as unknown as Chart;
};

const loadChartJs = () => {
  nextTick(() => {
    if (!(window as unknown as { Chart?: unknown }).Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
      script.onload = renderChart;
      document.head.appendChild(script);
    } else {
      renderChart();
    }
  });
};

watch([sessions, chartMode, selectedSeason], () => loadChartJs());
onMounted(loadChartJs);

// ── Sélecteur de saison ───────────────────────────────────────────────────────
function getSeasonLabel(date: Date): string | null {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  if (month >= 11) return `${year}-${year + 1}`;
  if (month <= 4) return `${year - 1}-${year}`;
  return null; // hors saison
}

const availableSeasons = computed(() => {
  const labels = new Set<string>();
  for (const s of sessions.value ?? []) {
    const label = getSeasonLabel(new Date(s.date));
    if (label) labels.add(label);
  }
  return [...labels].sort().reverse();
});

const selectedSeason = ref<string | null>(null);

// Initialiser sur la saison la plus récente dès que les données arrivent
watch(availableSeasons, (seasons) => {
  if (seasons.length > 0 && selectedSeason.value === null) {
    selectedSeason.value = seasons[0] ?? null;
  }
}, { immediate: true });

const filteredSessions = computed(() => {
  const all = sessions.value ?? [];
  if (!selectedSeason.value) return all;
  return all.filter(s => getSeasonLabel(new Date(s.date)) === selectedSeason.value);
});

// ── Stats globales ────────────────────────────────────────────────────────────
const globalStats = computed(() => {
  const s = filteredSessions.value;
  return {
    totalRuns: s.reduce((acc, s) => acc + (s.runCount ?? 0), 0),
    maxSpeed: s.reduce((acc, s) => Math.max(acc, s.maxSpeed ?? 0), 0),
    totalDistance: Math.round(s.reduce((acc, s) => acc + (s.totalDistance ?? 0), 0) * 10) / 10,
    totalVertical: s.reduce((acc, s) => acc + (s.verticalDrop ?? 0), 0),
  };
});

// ── Modale détail ─────────────────────────────────────────────────────────────
const selectedSession = ref<Session | null>(null);
const isDetailOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const sessionToDelete = ref<string | null>(null);

const openDetail = (session: Session) => {
  selectedSession.value = session;
  isDetailOpen.value = true;
};

const openEdit = () => {
  isDetailOpen.value = false;
  isEditModalOpen.value = true;
};

const closeEdit = () => {
  isEditModalOpen.value = false;
  selectedSession.value = null;
};

const handleUpdate = async ({ id, date, station, conditions, tricks, notes, rating, userId, runCount, maxSpeed, totalDistance, verticalDrop }: Session) => {
  await store.update(id, {
    date: new Date(date).toISOString(),
    station, conditions: conditions || undefined, tricks,
    notes: notes || undefined, rating, userId,
    runCount: runCount ?? undefined,
    maxSpeed: maxSpeed ?? undefined,
    totalDistance: totalDistance ?? undefined,
    verticalDrop: verticalDrop ?? undefined,
  });
  await fetchSessions();
  closeEdit();
};

const openDelete = (id: string) => {
  sessionToDelete.value = id;
  isDetailOpen.value = false;
  isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
  if (!sessionToDelete.value) return;
  await store.remove(sessionToDelete.value);
  await fetchSessions();
  isDeleteModalOpen.value = false;
  sessionToDelete.value = null;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (d: Date | string) =>
  new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const formatCondition = (key: string) => {
  const c = CONDITIONS[key as keyof typeof CONDITIONS];
  return c ? `${c.emoji} ${c.label}` : key;
};

const ratingStars = (r: number) => '★'.repeat(r) + '☆'.repeat(5 - r);
</script>

<template>
  <div class="page-container">
    <div class="flex items-start justify-between gap-4 flex-wrap mb-6">
      <AppPageHeader title="Mes stats" description="Historique et progression de tes rides"
        icon="i-lucide-bar-chart-3" />
      <UButton to="/sessions/add-session" color="primary" icon="i-lucide-plus" size="lg">
        Nouvelle session
      </UButton>
    </div>

    <!-- ── Sélecteur de saison ──────────────────────────────────────────── -->
    <div v-if="(sessions?.length ?? 0) > 0" class="flex items-center gap-2 flex-wrap mb-6">
      <button
        class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
        :class="selectedSeason === null
          ? 'bg-ice-500 text-white'
          : 'bg-mountain-100 dark:bg-mountain-700 text-mountain-600 dark:text-mountain-300 hover:bg-mountain-200 dark:hover:bg-mountain-600'"
        @click="selectedSeason = null"
      >
        Tout
      </button>
      <button
        v-for="season in availableSeasons"
        :key="season"
        class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
        :class="selectedSeason === season
          ? 'bg-ice-500 text-white'
          : 'bg-mountain-100 dark:bg-mountain-700 text-mountain-600 dark:text-mountain-300 hover:bg-mountain-200 dark:hover:bg-mountain-600'"
        @click="selectedSeason = season"
      >
        {{ season }}
      </button>
    </div>

    <!-- ── Stats globales perf ────────────────────────────────────────────── -->
    <div v-if="filteredSessions.length > 0" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <UCard class="text-center">
        <div class="py-1">
          <UIcon name="i-lucide-repeat" class="text-2xl text-ice-500 mb-1" />
          <p class="text-2xl font-bold text-mountain-900 dark:text-snow-50">{{ globalStats.totalRuns }}</p>
          <p class="text-xs text-muted mt-0.5">Descentes totales</p>
        </div>
      </UCard>
      <UCard class="text-center">
        <div class="py-1">
          <UIcon name="i-lucide-gauge" class="text-2xl text-ember-500 mb-1" />
          <p class="text-2xl font-bold text-mountain-900 dark:text-snow-50">
            {{ globalStats.maxSpeed > 0 ? globalStats.maxSpeed : '—' }}
            <span v-if="globalStats.maxSpeed > 0" class="text-sm font-normal text-muted">km/h</span>
          </p>
          <p class="text-xs text-muted mt-0.5">Vitesse max</p>
        </div>
      </UCard>
      <UCard class="text-center">
        <div class="py-1">
          <UIcon name="i-lucide-route" class="text-2xl text-forest-500 mb-1" />
          <p class="text-2xl font-bold text-mountain-900 dark:text-snow-50">
            {{ globalStats.totalDistance > 0 ? globalStats.totalDistance : '—' }}
            <span v-if="globalStats.totalDistance > 0" class="text-sm font-normal text-muted">km</span>
          </p>
          <p class="text-xs text-muted mt-0.5">Distance cumulée</p>
        </div>
      </UCard>
      <UCard class="text-center">
        <div class="py-1">
          <UIcon name="i-lucide-arrow-down-to-line" class="text-2xl text-powder-500 mb-1" />
          <p class="text-2xl font-bold text-mountain-900 dark:text-snow-50">
            {{ globalStats.totalVertical > 0 ? globalStats.totalVertical.toLocaleString('fr-FR') : '—' }}
            <span v-if="globalStats.totalVertical > 0" class="text-sm font-normal text-muted">m</span>
          </p>
          <p class="text-xs text-muted mt-0.5">Dénivelé cumulé</p>
        </div>
      </UCard>
    </div>

    <!-- ── Graphique double ───────────────────────────────────────────────── -->
    <UCard class="mb-8">
      <template #header>
        <div class="flex items-center justify-between flex-wrap gap-3">
          <h2 class="heading-card">
            <UIcon name="i-lucide-trending-up" class="text-ice-500" />
            Activité (12 derniers mois)
          </h2>
          <!-- Switcher -->
          <div class="flex items-center gap-1 bg-mountain-100 dark:bg-mountain-700 rounded-lg p-1">
            <button class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors" :class="chartMode === 'sessions'
              ? 'bg-white dark:bg-mountain-600 text-mountain-900 dark:text-snow-50 shadow-sm'
              : 'text-mountain-500 dark:text-mountain-400 hover:text-mountain-700'" @click="chartMode = 'sessions'">
              <UIcon name="i-lucide-bar-chart-3" class="mr-1" />
              Sessions
            </button>
            <button class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors" :class="chartMode === 'rating'
              ? 'bg-white dark:bg-mountain-600 text-mountain-900 dark:text-snow-50 shadow-sm'
              : 'text-mountain-500 dark:text-mountain-400 hover:text-mountain-700'" @click="chartMode = 'rating'">
              <UIcon name="i-lucide-star" class="mr-1" />
              Note moy.
            </button>
          </div>
        </div>
      </template>

      <div v-if="!filteredSessions.length" class="flex flex-col items-center justify-center py-12 text-center">
        <UIcon name="i-lucide-snowflake" class="text-5xl text-mountain-300 mb-3" />
        <p class="text-muted">Aucune session pour le moment.</p>
      </div>
      <div v-else style="position: relative; height: 260px;">
        <canvas ref="chartCanvas" />
      </div>
    </UCard>

    <!-- ── Liste compacte ─────────────────────────────────────────────────── -->
    <UCard>
      <template #header>
        <h2 class="heading-card">
          <UIcon name="i-lucide-list" class="text-ice-500" />
          Sessions ({{ filteredSessions.length }})
        </h2>
      </template>

      <!-- Vide -->
      <div v-if="!filteredSessions.length" class="text-center py-12">
        <UIcon name="i-lucide-snowflake" class="text-5xl text-mountain-300 mx-auto mb-3" />
        <p class="text-muted mb-4">Aucune session pour le moment.</p>
        <UButton v-if="!sessions?.length" to="/sessions/add-session" color="primary" icon="i-lucide-plus">
          Ajouter ma première session
        </UButton>
      </div>

      <!-- Liste -->
      <div v-else class="divide-y divide-mountain-100 dark:divide-mountain-700">
        <button v-for="session in filteredSessions" :key="session.id"
          class="w-full flex items-center gap-4 py-3 px-2 first:pt-0 last:pb-0 rounded-lg hover:bg-snow-100 dark:hover:bg-mountain-700/50 transition-colors text-left"
          @click="openDetail(session)">
          <!-- Icône -->
          <div class="w-9 h-9 rounded-lg bg-ice-50 dark:bg-ice-900/30 flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-mountain" class="text-lg text-ice-500" />
          </div>

          <!-- Station + date -->
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-mountain-900 dark:text-snow-50 truncate">{{ session.station }}</p>
            <p class="text-xs text-muted">{{ formatDate(session.date) }}</p>
          </div>

          <!-- Stats perf inline (si renseignées) -->
          <div class="hidden md:flex items-center gap-3 text-xs text-muted shrink-0">
            <span v-if="session.runCount" class="flex items-center gap-1">
              <UIcon name="i-lucide-repeat" class="text-ice-400" />{{ session.runCount }} runs
            </span>
            <span v-if="session.maxSpeed" class="flex items-center gap-1">
              <UIcon name="i-lucide-gauge" class="text-ember-400" />{{ session.maxSpeed }} km/h
            </span>
            <span v-if="session.verticalDrop" class="flex items-center gap-1">
              <UIcon name="i-lucide-arrow-down-to-line" class="text-powder-400" />{{
                session.verticalDrop.toLocaleString('fr-FR') }}m
            </span>
          </div>

          <!-- Condition badge -->
          <UBadge v-if="session.conditions" color="primary" variant="soft" size="sm" class="hidden sm:flex shrink-0">
            {{ formatCondition(session.conditions) }}
          </UBadge>

          <!-- Rating -->
          <span v-if="session.rating" class="text-sm text-powder-500 dark:text-powder-400 shrink-0 tabular-nums">
            {{ ratingStars(session.rating) }}
          </span>

          <UIcon name="i-lucide-chevron-right" class="text-mountain-300 shrink-0" />
        </button>
      </div>
    </UCard>

    <!-- ── Modale détail ──────────────────────────────────────────────────── -->
    <UModal v-model:open="isDetailOpen" :title="selectedSession?.station ?? ''" size="lg">
      <template #body>
        <div v-if="selectedSession" class="space-y-4 p-1">
          <!-- Date + conditions -->
          <div class="flex flex-wrap gap-2 items-center">
            <UBadge color="neutral" variant="soft" icon="i-lucide-calendar">
              {{ formatDate(selectedSession.date) }}
            </UBadge>
            <UBadge v-if="selectedSession.conditions" color="primary" variant="soft">
              {{ formatCondition(selectedSession.conditions) }}
            </UBadge>
            <UBadge v-if="selectedSession.rating" color="warning" variant="soft">
              {{ ratingStars(selectedSession.rating) }} {{ selectedSession.rating }}/5
            </UBadge>
          </div>

          <!-- Stats perf -->
          <div
            v-if="selectedSession.runCount || selectedSession.maxSpeed || selectedSession.totalDistance || selectedSession.verticalDrop"
            class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div v-if="selectedSession.runCount" class="info-box text-center shrink-0">
              <UIcon name="i-lucide-repeat" class="text-ice-500 mb-1" />
              <p class="font-bold text-mountain-900 dark:text-snow-50">{{ selectedSession.runCount }}</p>
              <p class="text-xs text-muted">descentes</p>
            </div>
            <div v-if="selectedSession.maxSpeed" class="info-box text-center">
              <UIcon name="i-lucide-gauge" class="text-ember-500 mb-1" />
              <p class="font-bold text-mountain-900 dark:text-snow-50">{{ selectedSession.maxSpeed }}</p>
              <p class="text-xs text-muted">km/h max</p>
            </div>
            <div v-if="selectedSession.totalDistance" class="info-box text-center">
              <UIcon name="i-lucide-route" class="text-forest-500 mb-1" />
              <p class="font-bold text-mountain-900 dark:text-snow-50">{{ selectedSession.totalDistance }}</p>
              <p class="text-xs text-muted">km</p>
            </div>
            <div v-if="selectedSession.verticalDrop" class="info-box text-center">
              <UIcon name="i-lucide-arrow-down-to-line" class="text-powder-500 mb-1" />
              <p class="font-bold text-mountain-900 dark:text-snow-50">{{
                selectedSession.verticalDrop.toLocaleString('fr-FR') }}</p>
              <p class="text-xs text-muted">m dénivelé</p>
            </div>
          </div>

          <!-- Tricks -->
          <div v-if="selectedSession.tricks?.length">
            <p class="text-label uppercase tracking-wide mb-2">Tricks</p>
            <div class="flex flex-wrap gap-1.5">
              <UBadge v-for="trick in selectedSession.tricks" :key="trick" color="warning" variant="subtle">
                <UIcon name="i-lucide-sparkles" class="mr-1" />{{ trick }}
              </UBadge>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="selectedSession.notes">
            <p class="text-label uppercase tracking-wide mb-2">Notes</p>
            <p
              class="text-sm text-mountain-600 dark:text-mountain-300 leading-relaxed bg-mountain-100/50 dark:bg-mountain-700/30 rounded-lg px-3 py-2">
              {{ selectedSession.notes }}
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex gap-3 w-full">
          <UButton color="error" variant="soft" icon="i-lucide-trash-2" @click="openDelete(selectedSession!.id)">
            Supprimer
          </UButton>
          <UButton color="primary" block icon="i-lucide-pencil" @click="openEdit">
            Modifier
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- ── Modale édition ─────────────────────────────────────────────────── -->
    <UModal v-model:open="isEditModalOpen" title="Modifier la session" size="lg">
      <template #body>
        <SessionsForm :session="selectedSession" :is-editing="true" @submit="handleUpdate" @cancel="closeEdit" />
      </template>
    </UModal>

    <!-- ── Modale suppression ─────────────────────────────────────────────── -->
    <UModal v-model:open="isDeleteModalOpen" title="Supprimer cette session ?">
      <template #body>
        <p class="text-body">Cette action est irréversible.</p>
      </template>
      <template #footer>
        <div class="flex gap-3 w-full">
          <UButton color="neutral" variant="outline" block @click="isDeleteModalOpen = false">Annuler</UButton>
          <UButton color="error" block icon="i-lucide-trash-2" @click="confirmDelete">Supprimer</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>