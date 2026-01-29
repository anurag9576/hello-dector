import { useState, useEffect } from 'react';
import axios from 'axios';

export type WeatherData = {
  temp: string;
  condition: string;
  aqi: string;
  aqiLabel: string;
  loading: boolean;
};

// Simple global cache to persist data across tab switches (re-mounts)
let weatherCache: Record<string, { data: WeatherData; timestamp: number }> = {};
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes

export const useLiveWeather = (city: string) => {
  const [weather, setWeather] = useState<WeatherData>(() => {
    // Check if we have valid cached data for this city
    const cached = weatherCache[city];
    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
      return { ...cached.data, loading: false };
    }
    
    return {
      temp: '22°C',
      condition: 'Clear sky',
      aqi: '42',
      aqiLabel: 'Good',
      loading: true,
    };
  });

  useEffect(() => {
    const fetchWeather = async () => {
      if (!city) {
        setWeather(prev => ({ ...prev, loading: false }));
        return;
      }

      // 1. Check Cache First
      const cached = weatherCache[city];
      if (cached && (Date.now() - cached.timestamp < CACHE_EXPIRY)) {
        setWeather({ ...cached.data, loading: false });
        return;
      }

      try {
        if (!weather.loading) {
           setWeather(prev => ({ ...prev, loading: true }));
        }

        // 1. Geocoding (City to Lat/Lon)
        const geoRes = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`);
        
        if (geoRes.data && geoRes.data.length > 0) {
          const { lat, lon } = geoRes.data[0];

          // 2. Fetch Weather & AQI (using Open-Meteo)
          const [weatherRes, aqiRes] = await Promise.all([
            axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`),
            axios.get(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5`)
          ]);

          const temp = Math.round(weatherRes.data.current_weather.temperature);
          const weatherCode = weatherRes.data.current_weather.weathercode;
          const aqi = aqiRes.data.current.us_aqi;

          // Simple weather code mapping for real conditions
          let condition = 'Clear sky';
          if (weatherCode > 0 && weatherCode <= 3) condition = 'Partly cloudy';
          if (weatherCode >= 45 && weatherCode <= 48) condition = 'Foggy';
          if (weatherCode >= 51 && weatherCode <= 67) condition = 'Rainy';
          if (weatherCode >= 71 && weatherCode <= 86) condition = 'Snowy';
          if (weatherCode >= 95) condition = 'Thunderstorm';

          // AQI Label mapping
          let aqiLabel = 'Good';
          if (aqi > 50) aqiLabel = 'Moderate';
          if (aqi > 100) aqiLabel = 'Unhealthy';
          if (aqi > 150) aqiLabel = 'Poor';
          if (aqi > 200) aqiLabel = 'Very Poor';

          const newWeatherData = {
            temp: `${temp}°C`,
            condition,
            aqi: `AQI ${aqi}`,
            aqiLabel,
            loading: false,
          };

          // Update Global Cache
          weatherCache[city] = {
            data: newWeatherData,
            timestamp: Date.now(),
          };

          setWeather(newWeatherData);
        } else {
          setWeather(prev => ({ ...prev, loading: false }));
        }
      } catch (err) {
        console.error('Weather fetch error:', err);
        setWeather(prev => ({ ...prev, loading: false }));
      }
    };

    fetchWeather();
  }, [city]);

  return weather;
};
