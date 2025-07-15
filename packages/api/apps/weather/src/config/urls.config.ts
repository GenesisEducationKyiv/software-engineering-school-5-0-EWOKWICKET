import { registerAs } from '@nestjs/config';

export default registerAs('urls', () => ({
  subscription: `http://localhost:3002/subscription`,
  notifications: `http://localhost:3001/notifications`,
}));
