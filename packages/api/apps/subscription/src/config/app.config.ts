import { registerAs } from '@nestjs/config';
import { env } from './env.validation';

export default registerAs('app', () => ({
  host: env.HOST,
  http: {
    port: env.HTTP_PORT,
  },
  grpc: {
    port: env.GRPC_PORT,
    package: env.SERVER_GRPC_PACKAGE,
  },
}));
