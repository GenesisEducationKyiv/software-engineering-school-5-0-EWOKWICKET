import { Module } from '@nestjs/common';
import { CityValidationService } from './city-validation.service';
import { CityService } from './city.service';

@Module({
  providers: [CityService, CityValidationService],
  exports: [CityValidationService],
})
export class CityModule {}
