import { registerAs } from '@nestjs/config';

export const databaseTestConfig = registerAs('database', () => ({
  dbUri: 'mongodb://mongo-test:27017/weatherAPI',
}));
