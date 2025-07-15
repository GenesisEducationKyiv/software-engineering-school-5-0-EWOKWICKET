import { registerAs } from '@nestjs/config';
import { env } from './env.validation';

export default registerAs('mail', () => ({
  mailHost: env.MAIL_HOST,
  mailPort: env.MAIL_PORT,
  mailUser: env.MAIL_USER,
  mailPass: env.MAIL_PASS,
}));
