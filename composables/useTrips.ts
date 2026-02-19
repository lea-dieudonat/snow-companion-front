import type { Station, StationFilters } from '@/types/station.types';
import { getDailyPassPrice } from '@/utils/station.utils';

export const useTrips = () => {
    const router = useRouter();
    const { getAllStations } = useStations();
    const { getFavorites, addFavorite, removeFavorite } = useUser();

    // --- Favoris ---
    const favoriteStations = ref<Station[]>([]);
    const favoriteIds = computed(() => favoriteStations.value.map(s => s.id));
    const loadingFavorites = ref(true);

    const loadFavorites =async () => {
        try {
            favoriteStations.value = await getFavorites();
        } catch (e) {
            console.error(e)
        } finally {
            loadingFavorites.value = false;
        }
    };

    // --- Handlers favoris ---
    const handleToggleFavorite = async (stationId: string) => {
        const isFav = favoriteIds.value.includes(stationId);
        try {
            if (isFav) {
            await removeFavorite(stationId);
            favoriteStations.value = favoriteStations.value.filter(s => s.id !== stationId);
            } else {
            await addFavorite(stationId);
            favoriteStations.value = await getFavorites();
            }
        } catch (e) {
            console.error(e);
        }
    }

    // --- Recherche ---
    const hasSearched = ref(false);
    const searchResults = ref<Station[]>([]);
    const loadingSearch = ref(false);
    const searchError = ref('');

    // --- Handlers recherche ---
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

            const apiFilters: any = {};
            if (query) apiFilters.search = query;
            // lodge
            if (filters.maxLodgingPrice) apiFilters.maxPrice = filters.maxLodgingPrice;

            let results = await getAllStations(apiFilters);

            // lift
            if (filters.maxLiftPassPrice) {
            results = results.filter(s => {
                const passPrice = getDailyPassPrice(s.passes);
                return typeof passPrice === 'number' && passPrice <= filters.maxLiftPassPrice;
            });
            }
            // levels
            if (filters.levels.length > 0) {
            results = results.filter(s => filters.levels.some((level: string) => s.level.includes(level)));
            }
            //TODO: add filter distance with user geoloc

            searchResults.value = results;
        } catch (e: any) {
            searchError.value = e.message || 'Erreur lors de la recherche';
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
        alert('Tu peux comparer maximum 3 stations à la fois !');
    }
    };

    return {
        // --- Favoris ---
        favoriteStations,
        favoriteIds,
        loadingFavorites,
        loadFavorites,
        handleToggleFavorite,

        // --- Recherche ---
        hasSearched,
        searchResults,
        loadingSearch,
        searchError,
        handleSearch,

        // --- Comparaison ---
        compareStations,
        handleCompareStation,
        handleSelectStation
    }
};