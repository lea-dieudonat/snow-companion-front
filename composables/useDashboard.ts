import type { Session } from '@/types/session.types';
import { CONDITIONS } from '@/constants/conditions';

export const useDashboard = () => {
    const sessionsStore = useSessionsStore();
    const favoritesStore = useFavoritesStore();
    const userStore = useUserStore();

    // ── Chargement ──────────────────────────────────────────────────────────
    const loading = ref(true);
    const error = ref('');

    const loadData = async () => {
        loading.value = true;
        error.value = '';
        try {
            await Promise.all([
                sessionsStore.load(),
                favoritesStore.load(),
            ]);
        } catch (e: unknown) {
            error.value = e instanceof Error ? e.message : 'Erreur de chargement';
        } finally {
            loading.value = false;
        }
    };

    // ── Sessions ─────────────────────────────────────────────────────────────
    const sessions = computed(() => sessionsStore.sessions);

    const totalSessions = computed(() => sessions.value.length);

    const averageRating = computed(() => {
        const rated = sessions.value.filter(s => s.rating != null);
        if (!rated.length) return null;
        const sum = rated.reduce((acc, s) => acc + (s.rating ?? 0), 0);
        return Math.round((sum / rated.length) * 10) / 10;
    });

    const totalTricks = computed(() =>
        sessions.value.reduce((acc, s) => acc + (s.tricks?.length ?? 0), 0)
    );

    const uniqueStations = computed(() =>
        new Set(sessions.value.map(s => s.station)).size
    );

    // ── Dernière session ─────────────────────────────────────────────────────
    const lastSession = computed((): Session | null => {
        if (!sessions.value.length) return null;
        return [...sessions.value].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0] ?? null;
    });

    // ── Station favorite (la plus visitée) ──────────────────────────────────
    const topStation = computed(() => {
        if (!sessions.value.length) return null;
        const counts: Record<string, number> = {};
        for (const s of sessions.value) {
            counts[s.station] = (counts[s.station] ?? 0) + 1;
        }
        const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
        return top ? { name: top[0], count: top[1] } : null;
    });

    // ── Condition la plus fréquente ──────────────────────────────────────────
    const topCondition = computed(() => {
        const withConditions = sessions.value.filter(s => s.conditions);
        if (!withConditions.length) return null;
        const counts: Record<string, number> = {};
        for (const s of withConditions) {
            const key = s.conditions!;
            counts[key] = (counts[key] ?? 0) + 1;
        }
        const [key] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] ?? [];
        if (!key) return null;
        const cond = CONDITIONS[key as keyof typeof CONDITIONS];
        return cond ? `${cond.emoji} ${cond.label}` : key;
    });

    // ── Données pour le graphique mensuel (12 derniers mois) ────────────────
    const chartData = computed(() => {
        const now = new Date();
        const months: { label: string; count: number }[] = [];

        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
            const count = sessions.value.filter(s => {
                const sd = new Date(s.date);
                return sd.getFullYear() === d.getFullYear() && sd.getMonth() === d.getMonth();
            }).length;
            months.push({ label, count });
        }

        return months;
    });

    // ── Sessions récentes (5 dernières) ─────────────────────────────────────
    const recentSessions = computed(() =>
        [...sessions.value]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
    );

    // ── Favoris ──────────────────────────────────────────────────────────────
    const favoritesCount = computed(() => favoritesStore.stations.length);

    // ── Utilisateur ──────────────────────────────────────────────────────────
    const userName = computed(() => userStore.currentUser?.name ?? userStore.currentUser?.email ?? 'Rider');

    return {
        // état
        loading,
        error,
        loadData,
        // stats
        totalSessions,
        averageRating,
        totalTricks,
        uniqueStations,
        favoritesCount,
        // sessions
        lastSession,
        topStation,
        topCondition,
        recentSessions,
        // chart
        chartData,
        // user
        userName,
    };
};