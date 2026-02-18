import type { Station } from '@/types/station.types';

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
    emoji: '🟠',
    classes: 'bg-powder-100 text-powder-700 dark:bg-powder-900/30 dark:text-powder-300',
  },
  expert: {
    label: 'Expert',
    emoji: '🔴',
    classes: 'bg-ember-200 text-ember-900 dark:bg-ember-800/30 dark:text-ember-200',
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
  Object.entries(SLOPE_COLOR_CONFIG).map(([key, { label, ...classes }]) => [key, classes])
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
export const getDailyPassPrice = (passes: Record<string, unknown>): number | null => {
  const fullDay = passes?.full_day as { adult?: number } | undefined;
  return fullDay?.adult ?? null;
};

/**
 * Formate le prix du forfait journée
 */
export const formatDailyPassPrice = (passes: Record<string, unknown>): string => {
  const price = getDailyPassPrice(passes);
  return typeof price === 'number' ? `${price}€` : 'N/A';
};

/**
 * Récupère la répartition des pistes par couleur
 */
export const getSlopesBreakdown = (slopesDetail: Record<string, unknown>) => {
  return {
    green: (slopesDetail?.green as number) ?? 0,
    blue: (slopesDetail?.blue as number) ?? 0,
    red: (slopesDetail?.red as number) ?? 0,
    black: (slopesDetail?.black as number) ?? 0,
  };
};

/**
 * Récupère les dates de saison formatées
 */
export const getSeasonDates = (season: Record<string, unknown>): string => {
  const start = season?.start as string | undefined;
  const end = season?.end as string | undefined;

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
export const getAccessInfo = (access: Record<string, unknown>) => {
  const airport = access?.nearest_airport as string | undefined;
  const airportDist = access?.distance_from_airport_km as number | undefined;
  const train = access?.nearest_train_station as string | undefined;
  const parking = access?.parking as boolean | undefined;
  const trainDist = access?.distance_from_train as number | undefined;

  return {
    airport: airport ? `${airport}${airportDist ? ` (${airportDist} km)` : ''}` : 'Non disponible',
    train: train ? `${train}${trainDist ? ` (${trainDist} km)` : ''}` : 'Non disponible',
    parking: parking ?? false,
  };
};