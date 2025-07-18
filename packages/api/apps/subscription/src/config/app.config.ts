import { registerAs } from '@nestjs/config';
import { env } from './env.validation';

const isDocker = env.NODE_ENV === 'development';

export default registerAs('app', () => ({
  host: env.HOST,
  port: env.PORT,
  weather: isDocker ? 'weather:50054' : 'localhost:50053',
  rmqUrl: env.RMQ_URL,
}));
