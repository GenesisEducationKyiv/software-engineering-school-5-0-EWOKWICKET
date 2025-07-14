import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { CityFacadeInterface } from 'src/weather/application/interfaces/weather-facade.interfaces';

@ValidatorConstraint({ async: true })
@Injectable()
export class CityExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly weather: CityFacadeInterface) {}

  async validate(value: string) {
    return await this.weather.cityExists(value);
  }

  defaultMessage() {
    return 'City Not Found';
  }
}
