export const DISCIPLINES = [
  { value: 'ski', label: 'Ski alpin' },
  { value: 'snowboard', label: 'Snowboard' },
  { value: 'telemark', label: 'Télémark' },
  { value: 'ski_touring', label: 'Ski de randonnée' },
  { value: 'cross_country', label: 'Ski de fond' },
];

export const RIDE_STYLES = [
  { value: 'piste', label: 'Piste' },
  { value: 'freeride', label: 'Freeride' },
  { value: 'freestyle', label: 'Freestyle' },
  { value: 'backcountry', label: 'Hors-piste' },
  { value: 'moguls', label: 'Bosses' },
];

export const LEVELS = [
  { value: 'beginner', label: 'Débutant' },
  { value: 'intermediate', label: 'Intermédiaire' },
  { value: 'advanced', label: 'Avancé' },
  { value: 'expert', label: 'Expert' },
];

export const FREESTYLE_LEVELS = [
  { value: 'none', label: 'Aucun' },
  { value: 'beginner', label: 'Débutant' },
  { value: 'intermediate', label: 'Intermédiaire' },
  { value: 'advanced', label: 'Avancé' },
];

export const SNOW_PREFERENCES = [
  { value: 'groomed', label: 'Piste damée' },
  { value: 'powder', label: 'Poudreuse' },
  { value: 'mixed', label: 'Les deux' },
];

export const REGIONS = [
  { value: 'alpes_nord', label: 'Alpes du Nord' },
  { value: 'alpes_sud', label: 'Alpes du Sud' },
  { value: 'pyrenees', label: 'Pyrénées' },
  { value: 'massif_central', label: 'Massif Central' },
  { value: 'vosges', label: 'Vosges' },
  { value: 'jura', label: 'Jura' },
];

export const BUDGET_RANGES = [
  { value: 'budget', label: 'Petit budget' },
  { value: 'mid', label: 'Moyen' },
  { value: 'premium', label: 'Premium' },
];

export const BOOLEAN_OPTIONS = [
  { label: 'Oui', value: true },
  { label: 'Non', value: false },
  { label: 'Non renseigné', value: null },
] as const;
