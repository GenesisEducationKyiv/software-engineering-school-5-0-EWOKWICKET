import { registerAs } from '@nestjs/config';
import { env } from './env.validation';

export default registerAs('clients', () => ({
  weather: {
    url: env.WEATHER_URL,
    package: env.WEATHER_PACKAGE,
  },
  subscription: {
    url: env.SUBSCRIPTION_URL,
    package: env.SUBSCRIPTION_PACKAGE,
  },
}));
