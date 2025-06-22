import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CityFetchService } from './city-fetch.service';
import { CityValidationService } from './city-validation.service';
import { CityExistsConstraint } from './constraints/city-exists.constraint';
import { CityFetch } from './interfaces/city-fetch.interface';

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
    CityValidationService,
  ],
  exports: [CityExistsConstraint],
})
export class CityModule {}
