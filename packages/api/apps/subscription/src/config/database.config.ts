import { registerAs } from '@nestjs/config';
import { env } from './env.validation';

export default registerAs('database', () => ({
  dbUri: env.DB_URI,
}));
