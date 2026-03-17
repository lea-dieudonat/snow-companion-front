export interface UserProfile {
  id: string;
  userId: string;
  disciplines: string[];
  primaryDiscipline: string | null;
  rideStyles: string[];
  freestyleLevel: string | null;
  snowPreference: string | null;
  offPiste: boolean | null;
  level: string | null;
  withChildren: boolean | null;
  regions: string[];
  budgetRange: string | null;
}

export interface UpsertProfilePayload {
  disciplines: string[];
  primaryDiscipline?: string;
  rideStyles: string[];
  freestyleLevel?: string;
  snowPreference?: string;
  offPiste?: boolean | null;
  level?: string;
  withChildren?: boolean | null;
  regions: string[];
  budgetRange?: string;
}

export const useProfile = () => {
  const api = useApi();

  const profile = ref<UserProfile | null>(null);
  const loading = ref(false);
  const saving = ref(false);
  const error = ref<string | null>(null);

  const load = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await api<{ profile: UserProfile | null }>('/users/profile');
      profile.value = res.profile;
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Erreur lors du chargement du profil';
    } finally {
      loading.value = false;
    }
  };

  const save = async (payload: UpsertProfilePayload): Promise<boolean> => {
    saving.value = true;
    error.value = null;
    try {
      const res = await api<{ profile: UserProfile }>('/users/profile', {
        method: 'PUT',
        body: payload,
      });
      profile.value = res.profile;
      return true;
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Erreur lors de la sauvegarde';
      return false;
    } finally {
      saving.value = false;
    }
  };

  return { profile, loading, saving, error, load, save };
};
