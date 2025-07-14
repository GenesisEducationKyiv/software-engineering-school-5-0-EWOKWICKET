import { registerAs } from '@nestjs/config';
import { appEnv } from './env.validation';

const baseUrl = `http://${appEnv.HOST}:${appEnv.PORT}`;

export default registerAs('urls', () => ({
  baseUrl,
  publicBaseUrl: `${baseUrl}/weatherapi.app/api`,
  subscription: `${baseUrl}/subscription`,
  weather: `${baseUrl}/weather`,
  notifications: `${baseUrl}/notifications`,
}));
