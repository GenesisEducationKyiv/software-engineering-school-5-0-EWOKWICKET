import { registerAs } from '@nestjs/config';
import { env } from './env.validation';

export default registerAs('logger', () => ({
  url: env.G_URL,
  auth: `${env.G_USER}:${env.G_KEY}`,
}));
