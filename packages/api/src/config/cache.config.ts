import { registerAs } from '@nestjs/config';
import { env } from './env.validation';

export default registerAs('cache', () => ({
  redis: {
    url: env.REDIS_URL,
  },
}));
