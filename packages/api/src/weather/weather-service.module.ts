import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CityFacadeInterface, WeatherFacadeInterface } from 'src/common/interfaces/weather-facade.interfaces';
import { CacheModule } from './cache/cache.module';
import { CityModule } from './city/city.module';
import cacheConfig from './config/cache.config';
import { weatherEnvSchema } from './config/env.validation';
import providersConfig from './config/providers.config';
import { WeatherFacade } from './public/weather.facade';
import { WeatherSchedulerModule } from './weather-scheduler/weather-scheduler.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [providersConfig, cacheConfig],
      validationSchema: weatherEnvSchema,
    }),
    WeatherModule,
    CityModule,
    CacheModule,
    WeatherSchedulerModule,
  ],
  providers: [WeatherFacade, { provide: WeatherFacadeInterface, useExisting: WeatherFacade }, { provide: CityFacadeInterface, useExisting: WeatherFacade }],
  exports: [WeatherFacadeInterface, CityFacadeInterface],
})
export class WeatherServiceModule {}
