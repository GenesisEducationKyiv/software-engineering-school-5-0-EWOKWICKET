import { config as dotenv } from 'dotenv';
import * as Joi from 'joi';

export const notificationsEnvSchema = Joi.object({
  HOST: Joi.string().default('0.0.0.0'),
  PORT: Joi.number().port().default(50051),
  NODE_ENV: Joi.string().default('development'),

  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.string().required(),
  MAIL_USER: Joi.string().required(),
  MAIL_PASS: Joi.string().required(),
}).unknown(true);

dotenv();
const { error, value: env } = notificationsEnvSchema.validate(process.env, { abortEarly: false });
if (error) {
  console.error('ENV VALIDATION ERROR:');
  error.details.forEach((detail) => {
    console.error(`- ${detail.message}`);
  });
  throw new Error('Invalid environment configuration.');
}

export { env };
