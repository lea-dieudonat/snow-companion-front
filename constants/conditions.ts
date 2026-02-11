export const CONDITIONS = {
  powder: { label: 'Powder', emoji: '❄️' },
  packed: { label: 'Packed', emoji: '🧊' },
  icy: { label: 'Icy', emoji: '🥶' },
  slush: { label: 'Slush', emoji: '💧' },
  groomed: { label: 'Groomed', emoji: '🏔️' },
  moguls: { label: 'Moguls', emoji: '⛷️' },
  fresh: { label: 'Fresh snow', emoji: '🌨️' },
  wet: { label: 'Wet snow', emoji: '🫠' },
} as const;

export type ConditionKey = keyof typeof CONDITIONS;

export const CONDITION_OPTIONS = Object.entries(CONDITIONS).map(([key, { label, emoji }]) => ({
  value: key,
  label: `${emoji} ${label}`,
}));
