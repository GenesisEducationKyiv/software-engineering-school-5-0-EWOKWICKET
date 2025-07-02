import { Module } from '@nestjs/common';
import { CityFetchService } from './city-fetch.service';
import { CityValidationService } from './city-validation.service';
import { CityExistsConstraint } from './constraints/city-exists.constraint';
import { CityFetch } from './interfaces/city-fetch.interface';

@Module({
  providers: [
    {
      provide: CityFetch,
      useClass: CityFetchService,
    },
    CityExistsConstraint,
    CityValidationService,
  ],
  exports: [CityExistsConstraint],
})
export class CityModule {}
