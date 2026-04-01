import type { SlopesDetail, StationPasses, StationAccess, StationSeason } from '@/types/station.types';

// ============================================================================
// CONFIGURATION DES NIVEAUX
// ============================================================================

/**
 * Configuration centralisée pour les niveaux de difficulté
 */
const LEVEL_CONFIG = {
  beginner: {
    label: 'Débutant',
    emoji: '🟢',
    classes: 'bg-forest-100 text-forest-600 dark:bg-forest-600/30 dark:text-forest-300',
  },
  intermediate: {
    label: 'Intermédiaire',
    emoji: '🔵',
    classes: 'bg-ice-100 text-ice-700 dark:bg-ice-700/30 dark:text-ice-300',
  },
  advanced: {
    label: 'Avancé',
    emoji: '🔴',
    classes: 'bg-ember-200 text-ember-900 dark:bg-ember-800/30 dark:text-ember-200',
  },
  expert: {
    label: 'Expert',
    emoji: '🟠',
    classes: 'bg-powder-100 text-powder-700 dark:bg-powder-900/30 dark:text-powder-300',
  },
} as const;

type LevelKey = keyof typeof LEVEL_CONFIG;

/**
 * Options de niveau pour les formulaires/filtres
 */
export const levelOptions = Object.entries(LEVEL_CONFIG).map(([value, config]) => ({
  value,
  label: `${config.emoji} ${config.label}`,
}));

/**
 * Récupère le label français d'un niveau
 */
export const getLevelLabel = (level: string): string => {
  return LEVEL_CONFIG[level as LevelKey]?.label || level;
};

/**
 * Récupère l'emoji d'un niveau
 */
export const getLevelEmoji = (level: string): string => {
  return LEVEL_CONFIG[level as LevelKey]?.emoji || '';
};

/**
 * Récupère le badge complet d'un niveau (emoji + label)
 */
export const getLevelBadge = (level: string): string => {
  const config = LEVEL_CONFIG[level as LevelKey];
  return config ? `${config.emoji} ${config.label}` : level;
};

/**
 * Récupère les classes Tailwind pour un badge de niveau
 */
export const getLevelBadgeClass = (level: string): string => {
  return LEVEL_CONFIG[level as LevelKey]?.classes || 'bg-snow-200 text-mountain-700 dark:bg-mountain-700 dark:text-mountain-300';
};

/**
 * Formate le profil de difficulté en chaîne lisible : "🟢 22% · 🔵 39% · 🔴 31% · ⚫ 8%"
 */
export const getSlopesLevelSummary = (slopesDetail: SlopesDetail | null | undefined): string => {
  if (!slopesDetail) return '';
  const total =
    (slopesDetail.green ?? 0) + (slopesDetail.blue ?? 0) +
    (slopesDetail.red ?? 0) + (slopesDetail.black ?? 0);
  if (total === 0) return '';
  const pct = (n: number) => Math.round((n / total) * 100);
  const parts: string[] = [];
  if (slopesDetail.green) parts.push(`🟢 ${pct(slopesDetail.green)}%`);
  if (slopesDetail.blue) parts.push(`🔵 ${pct(slopesDetail.blue)}%`);
  if (slopesDetail.red) parts.push(`🔴 ${pct(slopesDetail.red)}%`);
  if (slopesDetail.black) parts.push(`⚫ ${pct(slopesDetail.black)}%`);
  return parts.join(' · ');
};

// ============================================================================
// CONFIGURATION DES COULEURS DE PISTES
// ============================================================================

/**
 * Configuration centralisée pour les couleurs de pistes
 */
const SLOPE_COLOR_CONFIG = {
  green: {
    label: 'Vertes',
    bg: 'bg-forest-400',
    light: 'bg-forest-200 dark:bg-forest-400',
    text: 'text-forest-500 dark:text-forest-300',
  },
  blue: {
    label: 'Bleues',
    bg: 'bg-ice-500',
    light: 'bg-ice-200',
    text: 'text-ice-700 dark:text-ice-300',
  },
  red: {
    label: 'Rouges',
    bg: 'bg-ember-600',
    light: 'bg-ember-200',
    text: 'text-ember-700 dark:text-ember-300',
  },
  black: {
    label: 'Noires',
    bg: 'bg-mountain-800 dark:bg-powder-700',
    light: 'bg-mountain-300',
    text: 'text-mountain-900 dark:text-powder-500',
  },
} as const;

type SlopeColorKey = keyof typeof SLOPE_COLOR_CONFIG;

/**
 * Classes Tailwind pour les couleurs de pistes
 */
export const slopeColors = Object.fromEntries(
  Object.entries(SLOPE_COLOR_CONFIG).map(([key, { label: _label, ...classes }]) => [key, classes])
) as Record<SlopeColorKey, { bg: string; light: string; text: string }>;

/**
 * Récupère le label français d'une couleur de piste
 */
export const getSlopeColorLabel = (color: string): string => {
  return SLOPE_COLOR_CONFIG[color as SlopeColorKey]?.label || color;
};

// ============================================================================
// HELPERS POUR LES STATIONS
// ============================================================================

/**
 * Récupère le prix du forfait journée adulte
 */
export const getDailyPassPrice = (passes: StationPasses | null): number | null => {
  return passes?.full_day?.adult ?? null;
};

/**
 * Formate le prix du forfait journée
 */
export const formatDailyPassPrice = (passes: StationPasses | null): string => {
  const price = getDailyPassPrice(passes);
  return typeof price === 'number' ? `${price}€` : 'N/A';
};

/**
 * Récupère la répartition des pistes par couleur
 */
export const getSlopesBreakdown = (slopesDetail: SlopesDetail | null) => {
  return {
    green: slopesDetail?.green ?? 0,
    blue: slopesDetail?.blue ?? 0,
    red: slopesDetail?.red ?? 0,
    black: slopesDetail?.black ?? 0,
  };
};

/**
 * Récupère les dates de saison formatées
 */
export const getSeasonDates = (season: StationSeason | null): string => {
  const { start, end } = season ?? {};

  if (!start || !end) return 'Non disponible';

  return `${new Date(start).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long'
  })} - ${new Date(end).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long'
  })}`;
};

/**
 * Récupère les informations d'accès
 */
export const getAccessInfo = (access: StationAccess | null) => {
  const { nearest_airport: airport, distance_from_airport_km: airportDist, nearest_train_station: train, parking, distance_from_train: trainDist } = access ?? {};

  return {
    airport: airport ? `${airport}${airportDist ? ` (${airportDist} km)` : ''}` : 'Non disponible',
    train: train ? `${train}${trainDist ? ` (${trainDist} km)` : ''}` : 'Non disponible',
    parking: parking ?? false,
  };
};