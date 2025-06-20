import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { CityValidationService } from '../city-validation.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class CityExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly cityValidationService: CityValidationService) {}

  async validate(value: string) {
    try {
      await this.cityValidationService.validate(value);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage() {
    return 'City Not Found';
  }
}
