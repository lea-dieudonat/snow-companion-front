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

const profileExpanded = ref(true);

// ── Formulaire ────────────────────────────────────────────────────────────────
const success = ref(false);
const handleSubmit = async (payload: UpsertProfilePayload) => {
  success.value = false;
  const ok = await save(payload);
  if (ok) success.value = true;
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
            <ProfileRiderForm
              :profile="profile"
              :loading="loadingProfile"
              :saving="saving"
              :error="profileError"
              :success="success"
              compact
              @submit="handleSubmit"
            />
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
