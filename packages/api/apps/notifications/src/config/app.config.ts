import { registerAs } from '@nestjs/config';
import { env } from './env.validation';

export default registerAs('app', () => ({
  rmqUrl: env.RMQ_URL,
  nodeEnv: env.NODE_ENV,
}));
