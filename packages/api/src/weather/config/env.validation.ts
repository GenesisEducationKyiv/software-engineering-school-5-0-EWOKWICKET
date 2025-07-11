import { config as dotenv } from 'dotenv';
import * as Joi from 'joi';
import * as path from 'path';

export const weatherEnvSchema = Joi.object({
  WEATHERAPI_API_KEY: Joi.string().required(),
  OPENWEATHER_API_KEY: Joi.string().required(),

  REDIS_URL: Joi.string().default('redis://redis:6379'),
}).unknown(true);

const envPath = path.resolve(process.cwd(), 'src/weather/.env');
dotenv({ path: envPath });
const { error, value: weatherEnv } = weatherEnvSchema.validate(process.env, { abortEarly: false });
if (error) {
  console.error('ENV VALIDATION ERROR:');
  error.details.forEach((detail) => {
    console.error(`- ${detail.message}`);
  });
  throw new Error('Invalid environment configuration.');
}

export { weatherEnv };
