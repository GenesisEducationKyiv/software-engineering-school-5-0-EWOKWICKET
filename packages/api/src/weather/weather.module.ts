import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CityFacadeInterface, WeatherFacadePublic } from 'src/common/interfaces/weather-facade.interfaces';
import { CacheModule } from './cache/cache.module';
import { CityModule } from './city/city.module';
import cacheConfig from './config/cache.config';
import { weatherEnvSchema } from './config/env.validation';
import providersConfig from './config/providers.config';
import { WeatherFacade } from './public/weather.facade';
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
  providers: [WeatherFacade, { provide: WeatherFacadePublic, useExisting: WeatherFacade }, { provide: CityFacadeInterface, useExisting: WeatherFacade }],
  exports: [WeatherFacadePublic, CityFacadeInterface],
})
export class WeatherModule {}
