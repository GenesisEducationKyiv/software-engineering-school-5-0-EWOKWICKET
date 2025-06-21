import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CityValidationService } from './city-validation.service';
import { CityExistsConstraint } from './constraints/city-exists.constraint';
import { CityFetch } from './interfaces/city-fetch.interface';

const cityFetchMock: CityFetch = {
  searchCitiesRaw: async () => [{ name: 'Valid', region: '', country: '' }],
};

@Module({
  providers: [
    {
      provide: CityFetch,
      useFactory: (configService: ConfigService) => {
        if (configService.get('NODE_ENV') === 'e2e') return cityFetchMock;
      },
      inject: [ConfigService],
    },
    CityValidationService,
    CityExistsConstraint,
  ],
  exports: [CityExistsConstraint],
})
export class CityModule {}
