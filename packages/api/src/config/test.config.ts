import { registerAs } from '@nestjs/config';

export const appTestConfig = registerAs('app', () => ({
  host: '0.0.0.0',
  port: 3000,
  //   urls: {
  //     subscribe: parsedEnv.URLS.SUBSCRIBE,
  //     confirm: parsedEnv.URLS.CONFIRM,
  //     unsubscribe: parsedEnv.URLS.UNSUBSCRIBE,
  //     outerWeatherApi: parsedEnv.URLS.OUTER_WEATHER_API,
  //   },
}));

export const databaseTestConfig = registerAs('database', () => ({
  dbUri: 'mongodb://mongo-test:27017/weatherAPI',
}));
