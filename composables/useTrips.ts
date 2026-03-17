import type { Station, StationFilters } from '@/types/station.types';
import { getDailyPassPrice } from '@/utils/station.utils';

export const useTrips = () => {
    const router = useRouter();
    const toast = useToast();
    const { getAllStations } = useStations();
    const favorites = useFavoritesStore();
    const tripsStore = useTripsStore();

    // --- Recherche ---
    const hasSearched = ref(false);
    const searchResults = ref<Station[]>([]);
    const loadingSearch = ref(false);
    const searchError = ref('');

    const handleSearch = async (query: string, filters: StationFilters) => {
        if (!query && !Object.values(filters).some(v => v && (Array.isArray(v) ? v.length : true))) {
            hasSearched.value = false;
            searchResults.value = [];
            return;
        }

        try {
            loadingSearch.value = true;
            searchError.value = '';
            hasSearched.value = true;

            const apiFilters: Record<string, unknown> = {};
            if (query) apiFilters.search = query;
            if (filters.maxLodgingPrice) apiFilters.maxPrice = filters.maxLodgingPrice;

            let results = await getAllStations(apiFilters as Parameters<typeof getAllStations>[0]);

            if (filters.maxLiftPassPrice) {
                results = results.filter(s => {
                    const passPrice = getDailyPassPrice(s.passes);
                    return typeof passPrice === 'number' && passPrice <= filters.maxLiftPassPrice;
                });
            }
            if (filters.levels.length > 0) {
                results = results.filter(s => filters.levels.some((level: string) => s.level.includes(level)));
            }

            searchResults.value = results;
        } catch (e: unknown) {
            searchError.value = e instanceof Error ? e.message : 'Erreur lors de la recherche';
        } finally {
            loadingSearch.value = false;
        }
    };

    // --- Comparaison ---
    const compareStations = ref<Station[]>([]);

    const handleSelectStation = (station: Station) => {
        router.push(`/stations/${station.id}`);
    };

    const handleCompareStation = (station: Station) => {
        const index = compareStations.value.findIndex(s => s.id === station.id);
        if (index > -1) {
            compareStations.value.splice(index, 1);
        } else if (compareStations.value.length < 3) {
            compareStations.value.push(station);
        } else {
            toast.add({
                title: 'Comparaison limitée',
                description: 'Tu peux comparer maximum 3 stations à la fois.',
                color: 'warning',
            });
        }
    };

    return {
        // --- Favoris (depuis le store) ---
        favoriteStations: favorites.stations,
        favoriteIds: favorites.ids,
        loadingFavorites: favorites.loading,
        loadFavorites: favorites.load,
        handleToggleFavorite: favorites.toggle,

        // --- Recherche ---
        hasSearched,
        searchResults,
        loadingSearch,
        searchError,
        handleSearch,

        // --- Prochain voyage (depuis le store trips) ---
        tripsStore,

        // --- Comparaison ---
        compareStations,
        handleCompareStation,
        handleSelectStation,
    };
};