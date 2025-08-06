import { registerAs } from '@nestjs/config';
import { env } from './env.validation';

const BASE = `http://localhost:3000/weatherapi.app/api`;

export default registerAs('providers', () => ({
  weatherApiKey: env.WEATHERAPI_API_KEY,
  openWeatherApiKey: env.OPENWEATHER_API_KEY,
  urls: {
    subscribe: `${BASE}/subscribe`,
    confirm: `${BASE}/confirm`,
    unsubscribe: `${BASE}/unsubscribe`,
    weatherApi: 'http://api.weatherapi.com/v1',
    openWeather: 'https://api.openweathermap.org/data/2.5',
  },
}));
