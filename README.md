# Snow Companion — Frontend

Interface de tracking et planification pour riders. Recherche de stations, suivi de sessions, météo et favoris.

**Stack:** Nuxt 4 · Vue 3 · TypeScript · @nuxt/ui · Tailwind CSS v4 · Pinia

**Backend:** [snow-companion-api](https://github.com/lea-dieudonat/snow-companion-api) — REST API Node.js

## Installation

```bash
npm install
npx nuxi prepare   # génère les types Nuxt
```

Crée un fichier `.env` :

```env
API_BASE=http://localhost:3001/api
```

## Développement

```bash
npm run dev        # serveur de dev (http://localhost:3000)
npm run lint       # ESLint
npm run test:run   # tests unitaires
npm run build      # build production
```

## Fonctionnalités

- Authentification JWT (inscription / connexion)
- Recherche et comparaison de stations de ski
- Stations favorites avec météo
- Suivi de sessions de ride (conditions, tricks, notes, rating)
- Thème sombre / clair
