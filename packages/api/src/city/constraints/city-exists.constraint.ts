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
    return await this.chain.handle(value);
  }

  defaultMessage() {
    return 'City Not Found';
  }
}
