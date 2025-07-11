import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CityTestModule } from './city/city.module.test';
import cacheConfig from './config/cache.config';
import { weatherEnvSchema } from './config/env.validation';
import providersConfig from './config/providers.config';
import { WeatherTestModule } from './weather/weather.module.test';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [providersConfig, cacheConfig],
      validationSchema: weatherEnvSchema,
    }),
    WeatherTestModule,
    CityTestModule,
  ],
})
export class WeatherServiceModule {}
