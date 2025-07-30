import { LoggerModule } from '@logger/logger.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CityModule } from './city/city.module';
import appConfig from './config/app.config';
import cacheConfig from './config/cache.config';
import { weatherEnvSchema } from './config/env.validation';
import loggerConfig from './config/logger.config';
import providersConfig from './config/providers.config';
import { MetricsModule } from './metrics/metrics.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, providersConfig, loggerConfig, cacheConfig],
      validationSchema: weatherEnvSchema,
    }),
    HttpModule.register({ global: true }),
    LoggerModule.forRoot({
      service: 'Weather',
      samplingRate: 0.6,
    }),
    MetricsModule,
    WeatherModule,
    CityModule,
  ],
})
export class AppModule {}
