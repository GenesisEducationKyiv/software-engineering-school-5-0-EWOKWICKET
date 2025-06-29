import { Module } from '@nestjs/common';
import { CacheModule } from 'src/cache/cache.module';
import { LoggerModule } from 'src/logger/logger.module';
import { CityFetch } from './abstractions/city-fetch.abstract';
import { CityFetchService } from './city-fetch.service';
import { CityExistsConstraint } from './constraints/city-exists.constraint';
import { CityOpenWeatherHandler } from './handlers/city-openweather.handler';
import { CityWeatherApiHandler } from './handlers/city-weatherapi.handler';

@Module({
  imports: [LoggerModule, CacheModule],
  providers: [
    {
      provide: CityFetch,
      useClass: CityFetchService,
    },
    CityExistsConstraint,
    CityWeatherApiHandler,
    CityOpenWeatherHandler,
  ],
  exports: [CityExistsConstraint],
})
export class CityModule {}
