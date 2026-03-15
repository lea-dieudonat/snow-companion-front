export const useApi = () => {
  const config = useRuntimeConfig();
  const base = config.public.apiBase as string;
  const token = useCookie<string | null>('auth_token');

  return <T>(path: string, options?: Parameters<typeof $fetch>[1]): Promise<T> => {
    const authHeaders: Record<string, string> = token.value
      ? { Authorization: `Bearer ${token.value}` }
      : {};

    return $fetch<T>(`${base}${path}`, {
      ...options,
      headers: { ...authHeaders, ...(options?.headers as Record<string, string> | undefined) },
    });
  };
};
