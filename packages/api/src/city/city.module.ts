import { Module } from '@nestjs/common';
import { CityValidationService } from './city-validation.service';
import { CityService } from './city.service';
import { CityExistsConstraint } from './constraints/city-exists.constraint';

@Module({
  providers: [CityService, CityValidationService, CityExistsConstraint],
  exports: [CityExistsConstraint],
})
export class CityModule {}
