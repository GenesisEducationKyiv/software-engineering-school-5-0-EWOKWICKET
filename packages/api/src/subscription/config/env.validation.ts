import { config as dotenv } from 'dotenv';
import * as Joi from 'joi';
import * as path from 'path';

export const subscriptionEnvSchema = Joi.object({
  DB_URI: Joi.string().optional(),
}).unknown(true);

const envPath = path.resolve(process.cwd(), 'src/subscription/.env');
dotenv({ path: envPath });
const { error, value: subscriptionEnv } = subscriptionEnvSchema.validate(process.env, { abortEarly: false });
if (error) {
  console.error('ENV VALIDATION ERROR:');
  error.details.forEach((detail) => {
    console.error(`- ${detail.message}`);
  });
  throw new Error('Invalid environment configuration.');
}

export { subscriptionEnv };
