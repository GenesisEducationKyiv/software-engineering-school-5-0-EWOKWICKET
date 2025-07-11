import { registerAs } from '@nestjs/config';
import { weatherEnv } from './env.validation';

export default registerAs('cache', () => ({
  redis: {
    url: weatherEnv.REDIS_URL,
  },
}));
