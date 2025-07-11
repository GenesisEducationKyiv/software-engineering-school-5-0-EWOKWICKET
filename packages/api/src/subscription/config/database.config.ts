import { registerAs } from '@nestjs/config';
import { appEnv } from 'src/config/env.validation';
import { subscriptionEnv } from './env.validation';

export default registerAs('database', () => ({
  dbUri: subscriptionEnv.DB_URI || `mongodb://${appEnv.HOST}:27017/weatherAPI`,
}));
