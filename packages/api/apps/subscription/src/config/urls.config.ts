import { registerAs } from '@nestjs/config';

const isDocker = process.env.NODE_ENV === 'production';

export default registerAs('urls', () => ({
  notifications: isDocker
    ? 'http://notifications:3001/notifications'
    : 'http://localhost:3002/subscription',

  weather: isDocker
    ? 'http://weather:3003/weather'
    : 'http://localhost:3003/weather',
}));
