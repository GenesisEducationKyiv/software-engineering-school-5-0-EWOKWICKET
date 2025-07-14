import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from './cache/cache.module';
import { CityModule } from './city/city.module';
import { SubscriptionClient } from './clients/interfaces/subscription-client.interface';
import { SubscriptionHttpClient } from './clients/subscription.http-client';
import cacheConfig from './config/cache.config';
import { weatherEnvSchema } from './config/env.validation';
import providersConfig from './config/providers.config';
import { WeatherFacadeInterface } from './facade/interfaces/weather-facade.interface';
import { WeatherFacade } from './facade/weather.facade';
import { WeatherController } from './presentation/weather.controller';
import { SchedulerModule } from './scheduler/scheduler.module';
import { WeatherAPIModule } from './weather-api/weather-api.module';

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
    SchedulerModule,
  ],
  controllers: [WeatherController],
  providers: [
    { provide: WeatherFacadeInterface, useClass: WeatherFacade },
    { provide: SubscriptionClient, useClass: SubscriptionHttpClient },
  ],
  exports: [WeatherFacadeInterface, SubscriptionClient],
})
export class WeatherModule {}
