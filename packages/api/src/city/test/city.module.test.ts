import { Module } from '@nestjs/common';
import { CityFetch } from '../abstractions/city-fetch.abstract';
import { CityExistsConstraint } from '../constraints/city-exists.constraint';
import { CityOpenWeatherHandler } from '../handlers/city-openweather.handler';
import { CityWeatherApiHandler } from '../handlers/city-weatherapi.handler';

const cityFetchMock: CityFetch = {
  searchCitiesRaw: async () => [{ name: 'Valid', region: '', country: '' }],
};

@Module({
  providers: [
    {
      provide: CityFetch,
      useValue: cityFetchMock,
    },
    CityExistsConstraint,
    CityWeatherApiHandler,
    CityOpenWeatherHandler,
  ],
  exports: [CityExistsConstraint],
})
export class CityTestModule {}
