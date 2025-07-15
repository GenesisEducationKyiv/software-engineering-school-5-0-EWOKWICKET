import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from './cache/cache.module';
import { CityModule } from './city/city.module';
import appConfig from './config/app.config';
import cacheConfig from './config/cache.config';
import { weatherEnvSchema } from './config/env.validation';
import providersConfig from './config/providers.config';
import urlsConfig from './config/urls.config';
import { WeatherFacadeInterface } from './facade/interfaces/weather-facade.interface';
import { WeatherFacade } from './facade/weather.facade';
import { WeatherController } from './presentation/weather.controller';
import { WeatherAPIModule } from './weather-api/weather-api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, providersConfig, cacheConfig, urlsConfig],
      validationSchema: weatherEnvSchema,
    }),
    HttpModule.register({ global: true }),
    WeatherAPIModule,
    CityModule,
    CacheModule,
  ],
  controllers: [WeatherController],
  providers: [{ provide: WeatherFacadeInterface, useClass: WeatherFacade }],
  exports: [WeatherFacadeInterface],
})
export class AppModule {}
