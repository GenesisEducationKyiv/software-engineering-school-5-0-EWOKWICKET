import { registerAs } from '@nestjs/config';

export const appTestConfig = registerAs('app', () => ({
  host: '0.0.0.0',
  port: 3002,
  weather: 'weather:50054',
  rmqURL: 'amqp://guest:guest@localhost:5672',
  nodeEnv: 'development',
}));

export const databaseTestConfig = registerAs('database', () => ({
  dbUri: 'mongodb://mongo-test:27017/weatherAPI',
}));
