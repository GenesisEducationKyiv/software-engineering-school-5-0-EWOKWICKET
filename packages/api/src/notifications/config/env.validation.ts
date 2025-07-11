import { config as dotenv } from 'dotenv';
import * as Joi from 'joi';
import * as path from 'path';

export const notificationsEnvSchema = Joi.object({
  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.string().required(),
  MAIL_USER: Joi.string().required(),
  MAIL_PASS: Joi.string().required(),
}).unknown(true);

const envPath = path.resolve(process.cwd(), 'src/notifications/.env');
dotenv({ path: envPath });
const { error, value: env } = notificationsEnvSchema.validate(process.env, { abortEarly: false });
if (error) {
  console.error('ENV VALIDATION ERROR:');
  error.details.forEach((detail) => {
    console.error(`- ${detail.message}`);
  });
  throw new Error('Invalid environment configuration.');
}

export { env };
