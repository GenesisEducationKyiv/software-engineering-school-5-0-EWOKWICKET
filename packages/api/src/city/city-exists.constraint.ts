import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { CityProvider } from './interfaces/city.provider';

@ValidatorConstraint({ async: true })
@Injectable()
export class CityExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly cityProvider: CityProvider) {}

  async validate(value: string) {
    return await this.cityProvider.validateCity(value);
  }

  defaultMessage() {
    return 'City Not Found';
  }
}
