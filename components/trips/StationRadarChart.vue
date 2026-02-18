<script setup lang="ts">
import type { Station } from '@/types/station.types';
import {
    Chart,
    RadarController,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { getDailyPassPrice } from '@/utils/station.utils';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const props = defineProps<{
    stations: Station[];
}>();

const STATION_COLORS = [
    { border: 'rgba(99, 179, 237, 1)', bg: 'rgba(99, 179, 237, 0.15)' },
    { border: 'rgba(252, 129, 74, 1)', bg: 'rgba(252, 129, 74, 0.15)' },
    { border: 'rgba(104, 211, 145, 1)', bg: 'rgba(104, 211, 145, 0.15)' },
];

const normalize = (value: number, min: number, max: number) =>
    max === min ? 50 : Math.round(((value - min) / (max - min)) * 100);

const minMax = (arr: number[]) => ({ min: Math.min(...arr), max: Math.max(...arr) });

const buildRadarData = () => {
    const s = props.stations;
    const mm = {
        altMax: minMax(s.map(x => x.altitudeMax)),
        km: minMax(s.map(x => x.kmSlopes)),
        slopes: minMax(s.map(x => x.numSlopes)),
        lifts: minMax(s.map(x => x.numLifts)),
        cannons: minMax(s.map(x => x.snowCannons)),
        price: minMax(s.map(x => getDailyPassPrice(x.passes) ?? 0)),
        services: minMax(s.map(x => x.services?.length ?? 0)),
    };

    const defaultColor = { border: 'rgba(148, 163, 184, 1)', bg: 'rgba(148, 163, 184, 0.15)' };

    return {
        labels: ['Altitude max', 'Km de pistes', 'Nb pistes', 'Remontées', 'Canons à neige', 'Prix (inversé)', 'Services'],
        datasets: s.map((station, i) => {
            const color = STATION_COLORS[i] ?? defaultColor;
            const price = getDailyPassPrice(station.passes) ?? mm.price.max;
            const priceScore = mm.price.max === mm.price.min
                ? 50
                : Math.round(((mm.price.max - price) / (mm.price.max - mm.price.min)) * 100);

            return {
                label: station.name,
                data: [
                    normalize(station.altitudeMax, mm.altMax.min, mm.altMax.max),
                    normalize(station.kmSlopes, mm.km.min, mm.km.max),
                    normalize(station.numSlopes, mm.slopes.min, mm.slopes.max),
                    normalize(station.numLifts, mm.lifts.min, mm.lifts.max),
                    normalize(station.snowCannons, mm.cannons.min, mm.cannons.max),
                    priceScore,
                    normalize(station.services?.length ?? 0, mm.services.min, mm.services.max),
                ],
                borderColor: color.border,
                backgroundColor: color.bg,
                borderWidth: 2,
                pointBackgroundColor: color.border,
                pointRadius: 4,
            };
        }),
    };
};

const radarCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const initChart = () => {
    if (!radarCanvas.value) return;
    chartInstance?.destroy();

    chartInstance = new Chart(radarCanvas.value, {
        type: 'radar',
        data: buildRadarData(),
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    min: 0,
                    max: 100,
                    ticks: { display: false },
                    grid: { color: 'rgba(148, 163, 184, 0.2)' },
                    pointLabels: {
                        color: '#64748b',
                        font: { size: 12 },
                    },
                },
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#64748b', padding: 20, usePointStyle: true },
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw}/100`,
                    },
                },
            },
        },
    });
};

onMounted(() => initChart());
watch(() => props.stations, () => nextTick(() => initChart()), { deep: true });
onUnmounted(() => chartInstance?.destroy());
</script>

<template>
    <canvas ref="radarCanvas" />
</template>