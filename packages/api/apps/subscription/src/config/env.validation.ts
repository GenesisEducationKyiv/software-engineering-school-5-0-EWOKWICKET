import { config as dotenv } from 'dotenv';
import * as Joi from 'joi';

export const subscriptionEnvSchema = Joi.object({
  HOST: Joi.string().default('localhost'),
  PORT: Joi.number().port().default(3002),
  NODE_ENV: Joi.string().default('development'),

  DB_URI: Joi.string().optional().default(''),
}).unknown(true);

dotenv();
const { error, value: env } = subscriptionEnvSchema.validate(process.env, { abortEarly: false });
if (error) {
  console.error('ENV VALIDATION ERROR:');
  error.details.forEach((detail) => {
    console.error(`- ${detail.message}`);
  });
  throw new Error('Invalid environment configuration.');
}

export { env };
