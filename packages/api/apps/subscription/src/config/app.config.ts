import { registerAs } from '@nestjs/config';
import { env } from './env.validation';

export default registerAs('app', () => ({
  host: env.HOST,
  port: env.PORT,
  urls: {
    weather: env.WEATHER_URL,
    notifications: env.NOTIFICATIONS_URL,
  },
}));
