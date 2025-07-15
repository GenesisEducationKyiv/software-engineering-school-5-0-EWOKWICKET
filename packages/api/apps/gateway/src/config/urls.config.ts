import { registerAs } from '@nestjs/config';

export default registerAs('urls', () => ({
  subscription: `http://localhost:3002/subscription`,
  weather: `http://localhost:3003/weather`,
}));
