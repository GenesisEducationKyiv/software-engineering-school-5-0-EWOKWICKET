import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { WeatherClient } from 'src/subscription/clients/interfaces/weather-client.interface';

@ValidatorConstraint({ async: true })
@Injectable()
export class CityExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly weather: WeatherClient) {}

  async validate(value: string) {
    return await this.weather.cityExists(value);
  }

  defaultMessage() {
    return 'City Not Found';
  }
}
