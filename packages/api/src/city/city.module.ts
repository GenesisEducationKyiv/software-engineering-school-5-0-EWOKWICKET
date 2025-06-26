import { Module } from '@nestjs/common';
import { CityFetch } from './abstractions/city-fetch.abstract';
import { CityFetchService } from './city-fetch.service';
import { CityExistsConstraint } from './constraints/city-exists.constraint';
import { CityOpenWeatherHandler } from './handlers/city-openweather.handler';
import { CityWeatherApiHandler } from './handlers/city-weatherapi.handler';

const cityFetchMock: CityFetch = {
  searchCitiesRaw: async () => [{ name: 'Valid', region: '', country: '' }],
};

@Module({
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
