import { registerAs } from '@nestjs/config';
import { env } from './env.validation';

const BASE = `http://${env.HOST}:${env.PORT}/weatherapi.app/api`;

export default registerAs('app', () => ({
  host: env.HOST,
  port: env.PORT,
  weatherApiKey: env.WEATHERAPI_API_KEY,
  openWeatherApiKey: env.OPENWEATHER_API_KEY,
  urls: {
    subscribe: `${BASE}/subscribe`,
    confirm: `${BASE}/confirm`,
    unsubscribe: `${BASE}/unsubscribe`,
    weatherApi: 'http://api.weatherapi.com/v1',
    openWeatherApi: 'https://api.openweathermap.org/data/2.5',
  },
}));
