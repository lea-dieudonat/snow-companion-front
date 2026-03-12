import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        runtimeConfig: {
          public: {
            apiBase: 'http://localhost:3001/api',
          },
        },
      },
    },
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['stores/**', 'composables/**', 'utils/**'],
    },
  },
});
