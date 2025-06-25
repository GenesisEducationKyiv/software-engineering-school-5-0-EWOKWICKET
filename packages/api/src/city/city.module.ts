import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    CityFetchService,
    {
      provide: CityFetch,
      useFactory: (configService: ConfigService, cityFetchService: CityFetchService) => {
        if (configService.get('NODE_ENV') === 'e2e') return cityFetchMock;
        return cityFetchService;
      },
      inject: [ConfigService, CityFetchService],
    },
    CityExistsConstraint,
    CityWeatherApiHandler,
    CityOpenWeatherHandler,
  ],
  exports: [CityExistsConstraint],
})
export class CityModule {}
