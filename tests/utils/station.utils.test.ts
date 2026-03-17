// @vitest-environment node
import { describe, it, expect } from 'vitest';
import {
  getLevelLabel,
  getLevelEmoji,
  getLevelBadge,
  getLevelBadgeClass,
  getSlopeColorLabel,
  getDailyPassPrice,
  formatDailyPassPrice,
  getSlopesBreakdown,
  getSeasonDates,
  getAccessInfo,
} from '@/utils/station.utils';

describe('getLevelLabel', () => {
  it('retourne le label français pour les niveaux connus', () => {
    expect(getLevelLabel('beginner')).toBe('Débutant');
    expect(getLevelLabel('intermediate')).toBe('Intermédiaire');
    expect(getLevelLabel('advanced')).toBe('Avancé');
    expect(getLevelLabel('expert')).toBe('Expert');
  });

  it('retourne la valeur brute pour un niveau inconnu', () => {
    expect(getLevelLabel('unknown')).toBe('unknown');
  });
});

describe('getLevelEmoji', () => {
  it('retourne les bons emojis', () => {
    expect(getLevelEmoji('beginner')).toBe('🟢');
    expect(getLevelEmoji('intermediate')).toBe('🔵');
    expect(getLevelEmoji('advanced')).toBe('🔴');
    expect(getLevelEmoji('expert')).toBe('🟠');
  });

  it('retourne une chaîne vide pour un niveau inconnu', () => {
    expect(getLevelEmoji('unknown')).toBe('');
  });
});

describe('getLevelBadge', () => {
  it('combine emoji et label', () => {
    expect(getLevelBadge('beginner')).toBe('🟢 Débutant');
  });

  it('retourne la valeur brute pour un niveau inconnu', () => {
    expect(getLevelBadge('unknown')).toBe('unknown');
  });
});

describe('getLevelBadgeClass', () => {
  it('retourne des classes Tailwind pour les niveaux connus', () => {
    expect(getLevelBadgeClass('beginner')).toContain('bg-forest');
    expect(getLevelBadgeClass('expert')).toContain('bg-powder');
  });

  it('retourne la classe par défaut pour un niveau inconnu', () => {
    expect(getLevelBadgeClass('unknown')).toContain('bg-snow');
  });
});

describe('getSlopeColorLabel', () => {
  it('retourne les labels en français', () => {
    expect(getSlopeColorLabel('green')).toBe('Vertes');
    expect(getSlopeColorLabel('blue')).toBe('Bleues');
    expect(getSlopeColorLabel('red')).toBe('Rouges');
    expect(getSlopeColorLabel('black')).toBe('Noires');
  });

  it('retourne la valeur brute pour une couleur inconnue', () => {
    expect(getSlopeColorLabel('purple')).toBe('purple');
  });
});

describe('getDailyPassPrice', () => {
  it('retourne le prix adulte pleine journée', () => {
    expect(getDailyPassPrice({ full_day: { adult: 55 } })).toBe(55);
  });

  it('retourne null si le prix est absent', () => {
    expect(getDailyPassPrice({})).toBeNull();
    expect(getDailyPassPrice({ full_day: {} })).toBeNull();
  });
});

describe('formatDailyPassPrice', () => {
  it('formate avec le symbole euro', () => {
    expect(formatDailyPassPrice({ full_day: { adult: 48 } })).toBe('48€');
  });

  it('retourne N/A si le prix est absent', () => {
    expect(formatDailyPassPrice({})).toBe('N/A');
  });
});

describe('getSlopesBreakdown', () => {
  it('retourne la répartition des pistes', () => {
    const detail = { green: 12, blue: 25, red: 10, black: 5 };
    expect(getSlopesBreakdown(detail)).toEqual({ green: 12, blue: 25, red: 10, black: 5 });
  });

  it('retourne 0 pour les couleurs absentes', () => {
    expect(getSlopesBreakdown({})).toEqual({ green: 0, blue: 0, red: 0, black: 0 });
  });
});

describe('getSeasonDates', () => {
  it('formate les dates de saison en français', () => {
    const result = getSeasonDates({ start: '2024-12-14', end: '2025-04-27' });
    expect(result).toContain('14');
    expect(result).toContain('27');
  });

  it('retourne "Non disponible" si les dates manquent', () => {
    expect(getSeasonDates({})).toBe('Non disponible');
    expect(getSeasonDates({ start: '2024-12-14' })).toBe('Non disponible');
  });
});

describe('getAccessInfo', () => {
  it('formate les infos d\'accès complètes', () => {
    const access = {
      nearest_airport: 'Genève',
      distance_from_airport_km: 120,
      nearest_train_station: 'Bourg-Saint-Maurice',
      distance_from_train: 20,
      parking: true,
    };
    const result = getAccessInfo(access);
    expect(result.airport).toBe('Genève (120 km)');
    expect(result.train).toBe('Bourg-Saint-Maurice (20 km)');
    expect(result.parking).toBe(true);
  });

  it('retourne "Non disponible" si les infos sont absentes', () => {
    const result = getAccessInfo({});
    expect(result.airport).toBe('Non disponible');
    expect(result.train).toBe('Non disponible');
    expect(result.parking).toBe(false);
  });
});
