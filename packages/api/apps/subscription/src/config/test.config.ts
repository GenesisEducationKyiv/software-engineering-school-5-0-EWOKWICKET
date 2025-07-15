import { registerAs } from '@nestjs/config';

export const appTestConfig = registerAs('app', () => ({
  host: '0.0.0.0',
  port: 3002,
}));

export const databaseTestConfig = registerAs('database', () => ({
  dbUri: 'mongodb://mongo-test:27017/weatherAPI',
}));
