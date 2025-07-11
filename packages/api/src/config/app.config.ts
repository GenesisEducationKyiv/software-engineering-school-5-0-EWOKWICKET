import { registerAs } from '@nestjs/config';
import { appEnv } from './env.validation';

export default registerAs('app', () => ({
  host: appEnv.HOST,
  port: appEnv.PORT,
}));
