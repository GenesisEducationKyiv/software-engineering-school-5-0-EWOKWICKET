import { config as dotenv } from 'dotenv';
import * as Joi from 'joi';

export const subscriptionEnvSchema = Joi.object({
  //app
  HOST: Joi.string().required(),
  HTTP_PORT: Joi.number().port().required(),
  GRPC_PORT: Joi.number().port().required(),
  SERVER_GRPC_PACKAGE: Joi.string().required(),

  //weather micro
  WEATHER_GRPC_PACKAGE: Joi.string().required(),
  WEATHER_URL: Joi.string().required(),

  //notifications micro
  RMQ_URL: Joi.string().required(),
  NOTIFICATIONS_QUEUE: Joi.string().required(),
  NOTIFICATIONS_EXCHANGE: Joi.string().required(),
  NOTIFICATIONS_EXCHANGE_TYPE: Joi.string().required(),

  //db
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
