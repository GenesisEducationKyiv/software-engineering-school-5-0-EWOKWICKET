import { registerAs } from '@nestjs/config';

export const appTestConfig = registerAs('app', () => ({
  rmqUrl: 'amqp://guest:guest@localhost:5672',
  nodeEnv: 'development',
}));
