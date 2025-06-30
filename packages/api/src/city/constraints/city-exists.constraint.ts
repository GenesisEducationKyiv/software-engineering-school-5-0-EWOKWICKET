import { Inject, Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { CityProviderChain } from '../factories/city-validation.factory';
import { ChainableCityValidation } from '../interfaces/chainable-city-validation.provider';

@ValidatorConstraint({ async: true })
@Injectable()
export class CityExistsConstraint implements ValidatorConstraintInterface {
  constructor(
    @Inject(CityProviderChain)
    private readonly chain: ChainableCityValidation,
  ) {}

  async validate(value: string) {
    try {
      await this.chain.handle(value);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage() {
    return 'City Not Found';
  }
}
