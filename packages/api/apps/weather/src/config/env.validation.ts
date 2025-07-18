import { config as dotenv } from 'dotenv';
import * as Joi from 'joi';

export const weatherEnvSchema = Joi.object({
  HOST: Joi.string().required(),
  PORT: Joi.number().port().required(),

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
