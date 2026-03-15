# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
nuxt dev          # Start dev server (http://localhost:3000)
nuxt build        # Production build
nuxt generate     # Static site generation
nuxt preview      # Preview production build
nuxt prepare      # Generate Nuxt types (run after install)
npm run lint          # ESLint (Vue + TypeScript rules)
npm run lint:fix      # ESLint with auto-fix
npm run test          # Vitest in watch mode
npm run test:run      # Vitest single run (for CI)
npx vue-tsc --noEmit  # Type-check without building
```

## Architecture

**Stack:** Nuxt 4 + Vue 3 + TypeScript (strict) + @nuxt/ui + Tailwind CSS v4 + Pinia

**Backend:** REST API at `http://localhost:3001/api` (configurable via `API_BASE` env var).

### Key directories

- [pages/](pages/) — File-based routing. `index.vue` redirects to `/trips`. Dynamic routes use `[id].vue` convention.
- [components/app/](components/app/) — Shared layout primitives: `AppPageHeader`, `AppLoader`, `EmptyState`, `RangeFilter`.
- [composables/](composables/) — API composables (`useStations`, `useWeather`) and orchestration (`useTrips`). Pages/components stay thin.
- [stores/](stores/) — Pinia stores for shared state: `useUserStore`, `useFavoritesStore`, `useSessionsStore`.
- [types/](types/) — TypeScript interfaces (`Station`, `Session`, `StationFilters`, etc.)
- [utils/](utils/) — Pure helper functions (formatting, config lookups).
- [constants/](constants/) — Static data (e.g. ride condition options).
- [assets/css/main.css](assets/css/main.css) — Tailwind v4 `@theme` block with the custom Alpine color palette (Ice, Forest, Mountain, Powder, Ember, Snow) and reusable utility classes.

### Data fetching

All API calls go through `useApi()` ([composables/useApi.ts](composables/useApi.ts)), which wraps `$fetch` with the runtime config base URL. Never use raw `fetch()` or call `$fetch` directly with a full URL — always go through `useApi`.

```ts
const api = useApi()
const data = await api<Station[]>('/stations')
```

### Authentication

JWT-based auth. The token is stored in a cookie (`auth_token`) via `useCookie` — accessible on both client and server.

- `useUserStore` ([stores/user.ts](stores/user.ts)) — holds `token`, `currentUser`, `isAuthenticated`, `userId`. Exposes `login()`, `register()`, `logout()`, `fetchMe()`.
- On app init ([app.vue](app.vue)), `fetchMe()` calls `GET /auth/me` to restore `currentUser` from the cookie token. If the token is invalid, it auto-logs out and redirects to `/login`.
- `useApi()` automatically injects `Authorization: Bearer <token>` on every request when a token is present.
- `middleware/auth.ts` — route guard that redirects to `/login` if no token. Applied per-page via `definePageMeta({ middleware: 'auth' })`.
- Public pages (`/login`, `/register`) use `definePageMeta({ layout: false })` to bypass the default layout.

### State management

Shared state lives in Pinia stores (auto-imported from `stores/`):
- `useUserStore` — authenticated user + JWT token management
- `useFavoritesStore` — favorite stations, synced with the API
- `useSessionsStore` — ride sessions, synced with the API

Composables like `useStations` and `useWeather` are stateless API wrappers — they return async functions only, no refs. `useTrips` is an orchestration composable that combines `useStations` + `useFavoritesStore` for the trips page.

### Styling conventions

- Tailwind utility classes everywhere; avoid inline styles.
- Custom semantic classes (`.heading-page`, `.heading-card`, etc.) are defined in `main.css` — use them instead of repeating Tailwind combinations.
- Color tokens come from the Alpine theme: `primary` (ice), `secondary` (forest), `warning` (powder), `error` (ember), `neutral` (mountain).
- Dark mode is class-based via `useColorMode()`.

### Testing

Tests live in [tests/](tests/) mirroring the source structure (`stores/`, `utils/`). Uses Vitest + `@nuxt/test-utils` with the `nuxt` environment.

Pattern for store tests:
- Mock `useApi` with `vi.mock('@/composables/useApi', () => ({ useApi: () => mockApi }))`
- Mock dependent stores (e.g. `useUserStore`) the same way
- Call `setActivePinia(createPinia())` in `beforeEach`

Run a single test file:
```bash
npx vitest run tests/stores/user.test.ts
```

### CI

GitHub Actions ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs on every push: type-check → lint → test → build.

### Language

UI labels, comments, and strings are in **French**.
