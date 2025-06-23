import { Module } from '@nestjs/common';
import { CityValidationService } from '../city-validation.service';
import { CityExistsConstraint } from '../constraints/city-exists.constraint';
import { CityFetch } from '../interfaces/city-fetch.interface';

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
    CityValidationService,
  ],
  exports: [CityExistsConstraint],
})
export class CityTestModule {}
