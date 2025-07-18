import { registerAs } from '@nestjs/config';

export const appTestConfig = registerAs('app', () => ({
  host: '0.0.0.0',
  port: 3000,
  subscription: 'subscription:50052',
  weather: 'weather:50053',
  nodeEnv: 'development',
}));
