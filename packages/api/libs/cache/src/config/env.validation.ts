import { config as dotenv } from 'dotenv';
import * as Joi from 'joi';
import path from 'path';

export const cacheEnvSchema = Joi.object({
  REDIS_URL: Joi.string().required(),
}).unknown(true);

dotenv({
  path: path.resolve(process.cwd(), '..', '..', 'libs', 'cache', '.env'),
});
const { error, value: env } = cacheEnvSchema.validate(process.env, { abortEarly: false });
if (error) {
  console.error('ENV VALIDATION ERROR:');
  error.details.forEach((detail) => {
    console.error(`- ${detail.message}`);
  });
  throw new Error('Invalid environment configuration.');
}

export { env };
