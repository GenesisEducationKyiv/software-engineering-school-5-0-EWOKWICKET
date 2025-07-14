import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CityFacadeInterface, WeatherFacadePublic } from 'src/weather/application/interfaces/weather-facade.interfaces';
import { WeatherFacade } from './application/weather.facade';
import { CacheModule } from './cache/cache.module';
import { CityModule } from './city/city.module';
import cacheConfig from './config/cache.config';
import { weatherEnvSchema } from './config/env.validation';
import providersConfig from './config/providers.config';
import { PublicWeatherController } from './presentation/public.controller';
import { SubscriptionClient } from './public/interfaces/subscription-client.interface';
import { SubscriptionHttpClient } from './public/subscription.http-client';
import { WeatherAPIModule } from './weather-api/weather-api.module';
import { WeatherSchedulerModule } from './weather-scheduler/weather-scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [providersConfig, cacheConfig],
      validationSchema: weatherEnvSchema,
    }),
    WeatherAPIModule,
    CityModule,
    CacheModule,
    WeatherSchedulerModule,
  ],
  controllers: [PublicWeatherController],
  providers: [
    WeatherFacade,
    { provide: WeatherFacadePublic, useExisting: WeatherFacade },
    { provide: CityFacadeInterface, useExisting: WeatherFacade },
    { provide: SubscriptionClient, useClass: SubscriptionHttpClient },
  ],
  exports: [WeatherFacadePublic, CityFacadeInterface, SubscriptionClient],
})
export class WeatherModule {}
