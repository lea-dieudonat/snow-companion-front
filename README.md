# Snow Companion — Frontend

Ski and snowboard tracker and trip planner. Log sessions, research resorts, get personalized AI recommendations, and plan your next mountain trip.

**Backend:** [snow-companion-api](https://github.com/lea-dieudonat/snow-companion-api) — Express + TypeScript REST API

## Stack

- **Framework:** Nuxt 4 · Vue 3 · TypeScript (strict)
- **UI:** @nuxt/ui v4 · Lucide icons
- **Styling:** Tailwind CSS v4 · custom Alpine color palette
- **State:** Pinia
- **Charts:** Chart.js (bar, line, radar)

## Getting Started

```bash
npm install
npx nuxi prepare   # generate Nuxt types
```

Create a `.env` file:

```env
API_BASE=http://localhost:3001/api
```

```bash
npm run dev        # dev server at http://localhost:3000
```

**Demo account** (requires the backend seed to be run):

```
email:    demo@snowcompanion.app
password: demo1234
```

## Features

**Session tracker**

- Log ski/snowboard sessions: date, resort, conditions, tricks, rating, run count, max speed, vertical drop
- Stats dashboard: sessions over 12 months, average rating trend, total runs/distance/vertical
- Session history with detail modal and inline edit

**Trip planner**

- Search and filter 32 French resorts (region, level, altitude, price, snow park)
- Side-by-side resort comparison with radar chart (slopes, altitude, price, services)
- Plan upcoming trips linked to a specific resort and date
- Favorite resorts with live weather display

**AI Snow Planner**

- Conversational assistant powered by Claude (Anthropic)
- Real-time streaming via SSE — tokens appear word by word
- Personalized to your rider profile (discipline, style, level, preferred regions, budget)
- 6 tools: weather forecasts, resort search, resort comparison, session history, favorites
- Multi-tier model strategy: Haiku for routing, Sonnet for final synthesis
- Conversation history persisted across sessions

**Auth & settings**

- JWT authentication stored in cookie — session restored on page reload
- Rider profile: disciplines (ski/snowboard), ride styles, freestyle level, preferred regions, budget
- Dark/light theme toggle

## Architecture

### Key directories

```
pages/             — File-based routing (index.vue = dashboard)
components/
  app/             — Reusable primitives: AppPageHeader, AppLoader, AppEmptyState, RangeFilter
  sessions/        — Session form, cards, detail modal
  trips/           — Search form, favorites, radar chart, next trip section
  stations/        — Station detail, activity list, snow park info
composables/
  useApi.ts        — $fetch wrapper injecting base URL + auth token
  useAgent.ts      — SSE lifecycle: streaming, tool call badges, conversation state
  useDashboard.ts  — Dashboard stats computed from sessions store
  useTrips.ts      — Trips page orchestration (favorites + search + compare)
  useStations.ts   — Station search and comparison logic
stores/
  user.ts          — Auth state: token, currentUser, login/logout/fetchMe
  sessions.ts      — Sessions CRUD + cache
  favorites.ts     — Favorite stations state
  trips.ts         — Trip list + upcoming/next trip computed
assets/css/
  main.css         — Tailwind @theme block (Alpine palette) + @utility classes
```

### Data fetching

All API calls go through `useApi()`, which wraps `$fetch` with the runtime config base URL and auto-injects `Authorization: Bearer <token>`:

```ts
const api = useApi();
const stations = await api<Station[]>("/stations");
```

Never use raw `fetch()` or call `$fetch` with a hardcoded URL.

### Design system

Custom semantic color palette defined in `assets/css/main.css`:

| Token      | Usage                     |
| ---------- | ------------------------- |
| `ice`      | Primary brand color, CTAs |
| `mountain` | Text, neutral surfaces    |
| `snow`     | Backgrounds, cards        |
| `powder`   | Soft accents              |
| `ember`    | Warnings, highlights      |
| `forest`   | Success states            |

Reusable utility classes via Tailwind's `@utility` directive (`text-body`, `text-label`, `text-muted`, `page-container`, etc.) reduce repetitive Tailwind patterns across components.

## Development

```bash
npm run dev        # dev server
npm run lint       # ESLint (Vue + TypeScript rules)
npm run lint:fix   # auto-fix
npm run test:run   # Vitest single run
npx vue-tsc --noEmit  # type-check without building
npm run build      # production build
```
