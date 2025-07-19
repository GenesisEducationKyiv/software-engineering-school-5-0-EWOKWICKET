import { registerAs } from '@nestjs/config';
import { env } from './env.validation';

export default registerAs('app', () => ({
  rmqUrl: env.RMQ_URL,
  urls: {
    confirm: env.CONFIRM_URL,
    unsubscribe: env.UNSUBSCRIBE_URL,
  },
}));
