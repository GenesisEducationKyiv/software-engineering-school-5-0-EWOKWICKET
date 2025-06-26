import { registerAs } from '@nestjs/config';
import { env } from './env.validation';

const BASE = `http://${env.HOST}:${env.PORT}/weatherapi.app/api`;

export default registerAs('app', () => ({
  host: env.HOST,
  port: env.PORT,
  weatherApiKey: env.WEATHER_API_KEY,
  urls: {
    subscribe: `${BASE}/subscribe`,
    confirm: `${BASE}/confirm`,
    unsubscribe: `${BASE}/unsubscribe`,
    outerWeatherApi: 'http://api.weatherapi.com/v1',
  },
}));
