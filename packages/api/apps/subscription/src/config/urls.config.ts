import { registerAs } from '@nestjs/config';

const isDocker = process.env.NODE_ENV === 'production';

export default registerAs('urls', () => ({
  notifications: isDocker ? 'notifications:50051' : 'localhost:50051',

  weather: isDocker ? 'weather:50054' : 'localhost:50053',
}));
