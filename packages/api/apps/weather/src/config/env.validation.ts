import { config as dotenv } from 'dotenv';
import * as Joi from 'joi';

export const weatherEnvSchema = Joi.object({
  HOST: Joi.string().default('localhost'),
  PORT: Joi.number().port().default(3003),

  WEATHERAPI_API_KEY: Joi.string().required(),
  OPENWEATHER_API_KEY: Joi.string().required(),

  REDIS_URL: Joi.string().default('redis://redis:6379'),
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
