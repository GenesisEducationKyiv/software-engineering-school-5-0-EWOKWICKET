import { registerAs } from '@nestjs/config';

export default registerAs('urls', () => ({
  notifications: `http://localhost:3001/notifications`,
  weather: `http://localhost:3003/weather`,
}));
