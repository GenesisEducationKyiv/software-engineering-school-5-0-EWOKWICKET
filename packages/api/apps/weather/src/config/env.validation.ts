import { config as dotenv } from 'dotenv';
import * as Joi from 'joi';

export const weatherEnvSchema = Joi.object({
  //app
  HOST: Joi.string().required(),
  HTTP_PORT: Joi.number().port().required(),
  GRPC_PORT: Joi.number().port().required(),
  SERVER_GPRC_PACKAGE: Joi.string().required(),

  //providers
  WEATHERAPI_API_KEY: Joi.string().required(),
  OPENWEATHER_API_KEY: Joi.string().required(),

  //logger
  G_URL: Joi.string().required(),
  G_USER: Joi.string().required(),
  G_KEY: Joi.string().required(),

  //cache
  REDIS_URL: Joi.string().required(),
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
