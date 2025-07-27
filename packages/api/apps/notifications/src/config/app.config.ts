import { registerAs } from '@nestjs/config';
import { env } from './env.validation';

export default registerAs('app', () => ({
  rmqUrl: env.RMQ_URL,
  queue: env.SERVER_QUEUE,
  exchange: env.SERVER_EXCHANGE,
  exchangeType: env.SERVER_EXCHANGE_TYPE,
  routingKey: env.SERVER_ROUTING_KEY,
  urls: {
    confirm: env.CONFIRM_URL,
    unsubscribe: env.UNSUBSCRIBE_URL,
  },
}));
