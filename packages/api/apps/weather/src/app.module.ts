import { LoggerModule } from '@logger/logger.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CityModule } from './city/city.module';
import appConfig from './config/app.config';
import { weatherEnvSchema } from './config/env.validation';
import providersConfig from './config/providers.config';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, providersConfig],
      validationSchema: weatherEnvSchema,
    }),
    HttpModule.register({ global: true }),
    LoggerModule.forRoot({ service: 'Weather' }),
    WeatherModule,
    CityModule,
  ],
})
export class AppModule {}
