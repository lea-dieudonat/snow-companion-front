export const useUserStore = defineStore('user', () => {
  // TODO: remplacer par un vrai système d'authentification
  const userId = ref('cmlew0i3z000014oao6mkmk7m');

  return { userId };
});
