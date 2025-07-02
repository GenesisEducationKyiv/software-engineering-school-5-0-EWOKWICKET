import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ChainableCityProvider } from './interfaces/chainable-city.provider';

@ValidatorConstraint({ async: true })
@Injectable()
export class CityExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly cityProvider: ChainableCityProvider) {}

  async validate(value: string) {
    return await this.cityProvider.handle(value);
  }

  defaultMessage() {
    return 'City Not Found';
  }
}
