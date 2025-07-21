import { registerAs } from '@nestjs/config';
import { env } from './env.validation';

export default registerAs('app', () => ({
  host: env.HOST,
  port: env.PORT,
  urls: {
    subscription: env.SUBSCRIPTION_URL,
    weather: env.WEATHER_URL,
  },
}));
