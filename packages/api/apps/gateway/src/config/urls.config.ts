import { registerAs } from '@nestjs/config';

const isDocker = process.env.NODE_ENV === 'production';

export default registerAs('urls', () => ({
  subscription: isDocker ? 'subscription:50052' : 'localhost:50052',

  weather: isDocker ? 'weather:50053' : 'localhost:50053',
}));
