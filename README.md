# 🏔️ Snow Companion - Frontend

Interface utilisateur pour Snow Companion, plateforme de tracking et planification pour riders.

## 🚀 Stack

- **Nuxt 3** - Framework Vue.js
- **TypeScript** - Typage statique
- **Vue 3** - Framework UI
- **Vite** - Build tool

## 📦 Installation

```bash
npm install
```

## ⚙️ Configuration

Crée un fichier `.env` à la racine :

```env
API_BASE_URL=http://localhost:3001/api
```

## 🏃 Lancer le projet

```bash
# Mode développement
npm run dev

# Build production
npm run build
npm run preview
```

## 📁 Structure

```
components/
├── sessions/       # Composants liés aux sessions
composables/        # Composables réutilisables (API calls)
pages/              # Pages (routing automatique)
types/              # Types TypeScript
```

## 🎨 Features

- ✅ Création de sessions de ride
- 🚧 Liste des sessions (à venir)
- 🚧 Statistiques et progression (à venir)
- 🚧 Recherche de stations (à venir)
