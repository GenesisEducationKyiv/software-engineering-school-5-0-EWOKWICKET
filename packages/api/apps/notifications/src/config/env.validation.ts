import { config as dotenv } from 'dotenv';
import * as Joi from 'joi';

export const notificationsEnvSchema = Joi.object({
  RMQ_URL: Joi.string().required(),
  SERVER_QUEUE: Joi.string().required(),
  SERVER_EXCHANGE: Joi.string().required(),
  SERVER_EXCHANGE_TYPE: Joi.string().required(),
  SERVER_ROUTING_KEY: Joi.string().required(),

  CONFIRM_URL: Joi.string().required(),
  UNSUBSCRIBE_URL: Joi.string().required(),

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
