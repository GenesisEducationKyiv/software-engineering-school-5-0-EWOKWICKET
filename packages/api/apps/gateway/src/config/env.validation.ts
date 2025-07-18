import { config as dotenv } from 'dotenv';
import * as Joi from 'joi';

export const appEnvSchema = Joi.object({
  HOST: Joi.string().required(),
  PORT: Joi.number().port().required(),
  SUBSCRIPTION_URL: Joi.string().required(),
  WEATHER_URL: Joi.string().required(),
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
