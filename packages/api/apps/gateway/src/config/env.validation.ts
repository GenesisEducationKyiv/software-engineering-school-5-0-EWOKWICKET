import { config as dotenv } from 'dotenv';
import * as Joi from 'joi';

export const appEnvSchema = Joi.object({
  HOST: Joi.string().default('localhost'),
  PORT: Joi.number().port().default(3000),
  NODE_ENV: Joi.string().default('development'),
}).unknown(true);

dotenv();
const { error, value: env } = appEnvSchema.validate(process.env, { abortEarly: false });
if (error) {
  console.error('ENV VALIDATION ERROR:');
  error.details.forEach((detail) => {
    console.error(`- ${detail.message}`);
  });
  throw new Error('Invalid environment configuration.');
}

export { env };
