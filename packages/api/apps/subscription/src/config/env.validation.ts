import { config as dotenv } from 'dotenv';
import * as Joi from 'joi';

export const subscriptionEnvSchema = Joi.object({
  HOST: Joi.string().required(),
  PORT: Joi.number().port().required(),

  WEATHER_URL: Joi.string().required(),
  NOTIFICATIONS_URL: Joi.string().required(),
  DB_URI: Joi.string().required(),
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
