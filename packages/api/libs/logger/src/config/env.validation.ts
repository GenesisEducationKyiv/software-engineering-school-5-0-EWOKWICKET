import { config as dotenv } from 'dotenv';
import * as Joi from 'joi';
import * as path from 'path';

export const loggerEnvSchema = Joi.object({
  G_URL: Joi.string().required(),
  G_USER: Joi.string().required(),
  G_KEY: Joi.string().required(),
}).unknown(true);

dotenv({
  path: path.resolve(process.cwd(), '..', '..', 'libs', 'logger', '.env'),
});
const { error, value: env } = loggerEnvSchema.validate(process.env, { abortEarly: false });
if (error) {
  console.error('ENV VALIDATION ERROR:');
  error.details.forEach((detail) => {
    console.error(`- ${detail.message}`);
  });
  throw new Error('Invalid environment configuration.');
}

export { env };
