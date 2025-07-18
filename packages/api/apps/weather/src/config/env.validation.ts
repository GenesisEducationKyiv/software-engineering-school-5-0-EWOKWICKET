import { config as dotenv } from 'dotenv';
import * as Joi from 'joi';

export const weatherEnvSchema = Joi.object({
  HOST: Joi.string().default('0.0.0.0'),
  PORT: Joi.number().port().default(50053),
  NODE_ENV: Joi.string().default('development'),

  REDIS_URL: Joi.string().required(),

  WEATHERAPI_API_KEY: Joi.string().required(),
  OPENWEATHER_API_KEY: Joi.string().required(),
}).unknown(true);

dotenv();
const { error, value: env } = weatherEnvSchema.validate(process.env, { abortEarly: false });
if (error) {
  console.error('ENV VALIDATION ERROR:');
  error.details.forEach((detail) => {
    console.error(`- ${detail.message}`);
  });
  throw new Error('Invalid environment configuration.');
}

export { env };
