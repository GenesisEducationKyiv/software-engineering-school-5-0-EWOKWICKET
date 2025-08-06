import { registerAs } from '@nestjs/config';
import { env } from './env.validation';

export default registerAs('clients', () => ({
  weather: {
    url: env.WEATHER_URL,
    package: env.WEATHER_GRPC_PACKAGE,
  },
  notifications: {
    url: env.RMQ_URL,
    queue: env.NOTIFICATIONS_QUEUE,
    exchange: env.NOTIFICATIONS_EXCHANGE,
    exchangeType: env.NOTIFICATIONS_EXCHANGE_TYPE,
  },
}));
