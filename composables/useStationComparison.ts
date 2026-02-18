import type { Station } from '@/types/station.types';
import {
  getDailyPassPrice,
  getSeasonDates,
  getAccessInfo as getAccessInfoUtil,
  formatDailyPassPrice,
} from '@/utils/station.utils';

type WinnerMode = 'max' | 'min' | 'none';

export const useStationComparison = (stations: Ref<Station[] | null>) => {

  const getPassPrice = (s: Station): string => {
    return formatDailyPassPrice(s.passes);
  };

  const getSlopesDetail = (s: Station): string => {
    const detail = s.slopesDetail as Record<string, number>;
    if (!detail) return '—';
    const parts = [];
    if (detail.green) parts.push(`${detail.green} vertes`);
    if (detail.blue) parts.push(`${detail.blue} bleues`);
    if (detail.red) parts.push(`${detail.red} rouges`);
    if (detail.black) parts.push(`${detail.black} noires`);
    return parts.join(' · ') || '—';
  };

  const getSeasonInfo = (s: Station): string => {
    const dates = getSeasonDates(s.season);
    return dates === 'Non disponible' ? '—' : dates;
  };

  const getCompareAccessInfo = (s: Station): string => {
    const info = getAccessInfoUtil(s.access);
    const parts = [];
    if (info.airport !== 'Non disponible') parts.push(`✈️ ${info.airport}`);
    if (info.train !== 'Non disponible') parts.push(`🚆 ${info.train}`);
    if (info.parking) parts.push('🅿️ Parking');
    return parts.join(' / ') || '—';
  };

  const getWinnerIndex = (values: (number | null)[], mode: WinnerMode): number => {
    if (mode === 'none' || !stations.value) return -1;
    const valid = values.map((v, i) => ({ v, i })).filter(x => x.v !== null) as { v: number; i: number }[];
    if (valid.length < 2) return -1;
    return mode === 'max'
      ? valid.reduce((a, b) => (b.v > a.v ? b : a)).i
      : valid.reduce((a, b) => (b.v < a.v ? b : a)).i;
  };

  const tableRows = computed(() => {
    if (!stations.value) return [];
    const s = stations.value;

    return [
      // --- Domaine skiable ---
      { section: 'Domaine skiable', label: 'Altitude min', values: s.map(x => `${x.altitudeMin} m`), winner: getWinnerIndex(s.map(x => x.altitudeMin), 'max') },
      { section: null, label: 'Altitude max', values: s.map(x => `${x.altitudeMax} m`), winner: getWinnerIndex(s.map(x => x.altitudeMax), 'max') },
      { section: null, label: 'Km de pistes', values: s.map(x => `${x.kmSlopes} km`), winner: getWinnerIndex(s.map(x => x.kmSlopes), 'max') },
      { section: null, label: 'Ski area', values: s.map(x => x.skiArea || '—'), winner: -1 },
      // --- Pistes ---
      { section: 'Pistes', label: 'Nombre total', values: s.map(x => `${x.numSlopes}`), winner: getWinnerIndex(s.map(x => x.numSlopes), 'max') },
      { section: null, label: 'Détail', values: s.map(x => getSlopesDetail(x)), winner: -1 },
      { section: null, label: 'Canons à neige', values: s.map(x => `${x.snowCannons}`), winner: getWinnerIndex(s.map(x => x.snowCannons), 'max') },
      // --- Remontées ---
      { section: 'Remontées', label: 'Nombre', values: s.map(x => `${x.numLifts}`), winner: getWinnerIndex(s.map(x => x.numLifts), 'max') },
      // --- Prix ---
      { section: 'Tarifs', label: 'Forfait/jour adulte', values: s.map(x => getPassPrice(x)), winner: getWinnerIndex(s.map(x => getDailyPassPrice(x.passes)), 'min') },
      { section: null, label: 'Hébergement/nuit', values: s.map(x => x.avgAccommodationPrice ? `${x.avgAccommodationPrice} €` : '—'), winner: getWinnerIndex(s.map(x => x.avgAccommodationPrice), 'min') },
      // --- Saison ---
      { section: 'Saison', label: 'Période', values: s.map(x => getSeasonInfo(x)), winner: -1 },
      // --- Accès ---
      { section: 'Accès', label: 'Comment y aller', values: s.map(x => getCompareAccessInfo(x)), winner: -1 },
      // --- Services ---
      { section: 'Services', label: 'Équipements', values: s.map(x => x.services?.join(', ') || '—'), winner: -1 },
      { section: null, label: 'Activités', values: s.map(x => x.activities?.join(', ') || '—'), winner: -1 },
      // --- Niveaux ---
      { section: 'Niveaux', label: 'Public cible', values: s.map(x => x.level?.join(', ') || '—'), winner: -1 },
    ];
  });

  return {
    tableRows,
  };
};
