import { registerAs } from '@nestjs/config';
import { appEnv } from 'src/config/env.validation';
import { weatherEnv } from './env.validation';

const BASE = `http://${appEnv.HOST}:${appEnv.PORT}/weatherapi.app/api`;

export default registerAs('providers', () => ({
  weatherApiKey: weatherEnv.WEATHERAPI_API_KEY,
  openWeatherApiKey: weatherEnv.OPENWEATHER_API_KEY,
  urls: {
    subscribe: `${BASE}/subscribe`,
    confirm: `${BASE}/confirm`,
    unsubscribe: `${BASE}/unsubscribe`,
    weatherApi: 'http://api.weatherapi.com/v1',
    openWeather: 'https://api.openweathermap.org/data/2.5',
  },
}));
