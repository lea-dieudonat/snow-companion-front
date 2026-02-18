import type { Station } from '@/types/station.types';

// TODO: userId hardcodé
export const CURRENT_USER_ID = 'cmlew0i3z000014oao6mkmk7m';

export const useUser = () => {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase;

    const getFavorites = async (): Promise<Station[]> => {
        const response = await fetch(`${apiBase}/users/${CURRENT_USER_ID}/favorites`);
        if (!response.ok) throw new Error('Impossible de récupérer les favoris');
        return response.json();
    };
    
    const addFavorite = async (stationId: string): Promise<void> => {
        const response = await fetch(`${apiBase}/users/${CURRENT_USER_ID}/favorites/${stationId}`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Impossible d\'ajouter aux favoris');
    };
    
    const removeFavorite = async (stationId: string): Promise<void> => {
        const response = await fetch(`${apiBase}/users/${CURRENT_USER_ID}/favorites/${stationId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Impossible de retirer des favoris');
    };
    
    return { getFavorites, addFavorite, removeFavorite };
};