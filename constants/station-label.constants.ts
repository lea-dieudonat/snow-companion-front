// constants/station-labels.constants.ts
// Source unique de vérité pour la traduction des activities, services et snow_park
// Utilisé partout dans l'app : composants, agent IA, pages station

// ─── Activities ─────────────────────────────────────────────────────────────

export type ActivityKey =
  | 'snowshoeing'
  | 'ice_skating'
  | 'dog_sledding'
  | 'paragliding'
  | 'snow_scooter'
  | 'snow_cart'
  | 'bobsled'
  | 'ice_diving'

export interface ActivityConfig {
  label: string        // Nom affiché à l'utilisateur
  icon: string         // Icône Lucide
  description: string  // Courte description pour l'agent et les tooltips
  weatherSensitive: boolean         // L'activité dépend des conditions météo
  minTemp?: number     // Température minimale recommandée (°C)
  maxWind?: number     // Vent max recommandé (km/h)
}

export const ACTIVITY_CONFIG: Record<ActivityKey, ActivityConfig> = {
  snowshoeing: {
    label: 'Raquettes',
    icon: 'i-lucide-footprints',
    description: 'Randonnée en raquettes dans la neige fraîche',
    weatherSensitive: false,
  },
  ice_skating: {
    label: 'Patinoire',
    icon: 'i-lucide-circle',
    description: 'Patinage sur glace en intérieur ou extérieur',
    weatherSensitive: false,
  },
  dog_sledding: {
    label: 'Chiens de traîneau',
    icon: 'i-lucide-dog',
    description: 'Randonnée en traîneau tiré par des huskies',
    weatherSensitive: true,
    maxWind: 50,
  },
  paragliding: {
    label: 'Parapente',
    icon: 'i-lucide-wind',
    description: 'Vol en parapente avec instructeur depuis les sommets',
    weatherSensitive: true,
    maxWind: 40,
  },
  snow_scooter: {
    label: 'Motoneige',
    icon: 'i-lucide-zap',
    description: 'Balades en motoneige sur pistes balisées',
    weatherSensitive: false,
  },
  snow_cart: {
    label: 'Luge alpine',
    icon: 'i-lucide-arrow-down',
    description: 'Descente en luge ou kart des neiges',
    weatherSensitive: false,
  },
  bobsled: {
    label: 'Bobsleigh',
    icon: 'i-lucide-chevrons-right',
    description: 'Descente en bobsleigh sur piste olympique',
    weatherSensitive: false,
  },
  ice_diving: {
    label: 'Plongée sous glace',
    icon: 'i-lucide-waves',
    description: 'Plongée sous-lacustre en conditions hivernales',
    weatherSensitive: true,
    minTemp: -5,
  },
}

// ─── Services ───────────────────────────────────────────────────────────────

export type ServiceKey =
  | 'ski_school'
  | 'equipment_rental'
  | 'child_care'
  | 'medical_center'
  | 'spa'

export interface ServiceConfig {
  label: string
  icon: string
  description: string
  relevantFor: ('family' | 'beginner' | 'all')[]
}

export const SERVICE_CONFIG: Record<ServiceKey, ServiceConfig> = {
  ski_school: {
    label: 'École de ski / snowboard',
    icon: 'i-lucide-graduation-cap',
    description: 'Cours collectifs et particuliers pour tous niveaux',
    relevantFor: ['beginner', 'all'],
  },
  equipment_rental: {
    label: 'Location de matériel',
    icon: 'i-lucide-package',
    description: 'Skis, snowboards, casques et équipement complet',
    relevantFor: ['all'],
  },
  child_care: {
    label: 'Garderie / Jardin des neiges',
    icon: 'i-lucide-baby',
    description: 'Accueil des enfants en bas âge et initiation ski',
    relevantFor: ['family'],
  },
  medical_center: {
    label: 'Centre médical',
    icon: 'i-lucide-cross',
    description: 'Médecins de montagne et service de secours sur piste',
    relevantFor: ['all'],
  },
  spa: {
    label: 'Spa & bien-être',
    icon: 'i-lucide-sparkles',
    description: 'Piscine, hammam, soins et récupération après le ski',
    relevantFor: ['all'],
  },
}

// ─── Snow Park ───────────────────────────────────────────────────────────────

export type SnowParkLevel = 'beginner' | 'intermediate' | 'advanced'

export const SNOW_PARK_LEVEL_CONFIG: Record<SnowParkLevel, { label: string; icon: string; color: string }> = {
  beginner: {
    label: 'Débutant park',
    icon: 'i-lucide-circle',
    color: 'text-green-500',
  },
  intermediate: {
    label: 'Confirmé',
    icon: 'i-lucide-triangle',
    color: 'text-blue-500',
  },
  advanced: {
    label: 'Expert / Compétition',
    icon: 'i-lucide-zap',
    color: 'text-powder-500',
  },
}

export const SNOW_PARK_FEATURE_LABELS: Record<string, string> = {
  halfpipe: 'Half-pipe',
  rails: 'Rails & boxes',
  kickers: 'Kickers & tables',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Retourne le label traduit d'une activité, ou la clé brute si inconnue */
export const getActivityLabel = (key: string): string =>
  ACTIVITY_CONFIG[key as ActivityKey]?.label ?? key

/** Retourne le label traduit d'un service, ou la clé brute si inconnue */
export const getServiceLabel = (key: string): string =>
  SERVICE_CONFIG[key as ServiceKey]?.label ?? key

/** Retourne la config météo d'une activité pour l'agent */
export const getActivityWeatherConfig = (key: string) =>
  ACTIVITY_CONFIG[key as ActivityKey] ?? null

/** Génère la description textuelle du snow park pour le system prompt de l'agent */
export const formatSnowParkForAgent = (snowPark: {
  available: boolean
  halfpipe: boolean
  rails: boolean
  kickers: boolean
  level: string[]
} | null): string => {
  if (!snowPark?.available) return 'Pas de snow park'

  const features = [
    snowPark.halfpipe && 'half-pipe',
    snowPark.rails && 'rails & boxes',
    snowPark.kickers && 'kickers',
  ].filter(Boolean).join(', ')

  const levels = snowPark.level
    .map(l => SNOW_PARK_LEVEL_CONFIG[l as SnowParkLevel]?.label ?? l)
    .join(', ')

  return `Snow park (${features}) — niveaux : ${levels}`
}