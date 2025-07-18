import { registerAs } from '@nestjs/config';
import { env } from './env.validation';

const nodeEnv = env.NODE_ENV;
const isDocker = nodeEnv === 'development';

export default registerAs('app', () => ({
  host: env.HOST,
  port: env.PORT,
  subscription: isDocker ? 'subscription:50052' : 'localhost:50052',
  weather: isDocker ? 'weather:50053' : 'localhost:50053',
  nodeEnv,
}));
