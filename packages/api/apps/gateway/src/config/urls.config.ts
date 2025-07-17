import { registerAs } from '@nestjs/config';

const isDocker = process.env.NODE_ENV === 'production';

export default registerAs('urls', () => ({
  subscription: isDocker
    ? 'http://subscription:3002/subscription'
    : 'http://localhost:3002/subscription',

  weather: isDocker
    ? 'http://weather:3003/weather'
    : 'http://localhost:3003/weather',
}));
