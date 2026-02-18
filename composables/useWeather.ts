export interface WeatherData {
    temperature: number;
    windspeed: number;
    weathercode: number;
    snowfall: number; // cm tombés ajdh
    forecast: ForecastDay[];
}

export interface ForecastDay {
    date: string;
    temperature_max: number;
    temperature_min: number;
    weathercode: number;
    snowfall: number; // cm prévus
}

// Descriptions WMO simplifiées pour la montagne
const WMO_LABELS: Record<number, { label: string; icon: string }> = {
    0: { label: 'Ciel dégagé', icon: 'i-lucide-sun' },
    1: { label: 'Peu nuageux', icon: 'i-lucide-cloud-sun' },
    2: { label: 'Nuageux', icon: 'i-lucide-cloud' },
    3: { label: 'Couvert', icon: 'i-lucide-cloud' },
    45: { label: 'Brouillard', icon: 'i-lucide-cloud-fog' },
    48: { label: 'Brouillard givrant', icon: 'i-lucide-cloud-fog' },
    51: { label: 'Bruine', icon: 'i-lucide-cloud-drizzle' },
    61: { label: 'Pluie', icon: 'i-lucide-cloud-rain' },
    71: { label: 'Neige', icon: 'i-lucide-cloud-snow' },
    73: { label: 'Grêle', icon: 'i-lucide-cloud-hail' },
    75: { label: 'Neige forte', icon: 'i-lucide-cloud-snow' },
    77: { label: 'Grésil', icon: 'i-lucide-cloud-hail' },
    85: { label: 'Averses de neige', icon: 'i-lucide-cloud-snow' },
    86: { label: 'Averses de neige fortes', icon: 'i-lucide-cloud-snow' },
    95: { label: 'Orage', icon: 'i-lucide-cloud-lightning' },
};

export const getWeatherInfo = (code: number) => 
    WMO_LABELS[code] ?? { label: 'Inconnu', icon: 'i-lucide-cloud' };

export const useWeather = () => {
    const getWeather = async (latitude: number, longitude: number): Promise<WeatherData> => {
        const params = new URLSearchParams({
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            current: 'temperature_2m,wind_speed_10m,weather_code,snowfall',
            daily: 'temperature_2m_max,temperature_2m_min,weather_code,snowfall_sum',
            timezone: 'Europe/Paris',
            forecast_days: '3',
        });

        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
        if (!response.ok) {
            throw new Error('Météo indisponible');
        }

        const data = await response.json();

        const forecast: ForecastDay[] = data.daily.time.map((date: string, index: number) => ({
            date,
            temperature_max: Math.round(data.daily.temperature_2m_max[index]),
            temperature_min: Math.round(data.daily.temperature_2m_min[index]),
            weathercode: data.daily.weather_code[index],
            snowfall: Math.round(data.daily.snowfall_sum[index]),
        }));

        return {
            temperature: Math.round(data.current.temperature_2m),
            windspeed: Math.round(data.current.wind_speed_10m),
            weathercode: data.current.weather_code,
            snowfall: Math.round(data.current.snowfall),
            forecast,
        };
    };
    
    return { getWeather };
};