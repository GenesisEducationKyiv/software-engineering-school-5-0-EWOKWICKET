import { registerAs } from '@nestjs/config';
import { env } from './env.validation';

export default registerAs('app', () => ({
  host: env.HOST,
  port: env.PORT,
  grpcPackage: env.SERVER_PACKAGE,
}));
