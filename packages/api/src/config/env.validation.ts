import { config as dotenv } from 'dotenv';
import * as Joi from 'joi';

export const envSchema = Joi.object({
  HOST: Joi.string().default('localhost'),
  PORT: Joi.number().port().default(3000),

  WEATHERAPI_API_KEY: Joi.string().required(),
  OPENWEATHER_API_KEY: Joi.string().required(),

  DB_URI: Joi.string().optional(),

  REDIS_URL: Joi.string().default('redis://redis:6379'),

  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.string().required(),
  MAIL_USER: Joi.string().required(),
  MAIL_PASS: Joi.string().required(),
}).unknown(true);

dotenv();
const { error, value: env } = envSchema.validate(process.env, { abortEarly: false });
if (error) {
  console.error('ENV VALIDATION ERROR:');
  error.details.forEach((detail) => {
    console.error(`- ${detail.message}`);
  });
  throw new Error('Invalid environment configuration.');
}

export { env };
