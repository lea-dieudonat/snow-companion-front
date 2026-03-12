export const useApi = () => {
  const config = useRuntimeConfig();
  const base = config.public.apiBase as string;

  return <T>(path: string, options?: Parameters<typeof $fetch>[1]): Promise<T> => {
    return $fetch<T>(`${base}${path}`, options);
  };
};
