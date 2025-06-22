import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { OpenWeatherHandler } from '../handlers/openweather.handler';
import { WeatherApiHandler } from '../handlers/weatherapi.handler';
import { CityHandler } from '../interfaces/city-handler.interface';

@ValidatorConstraint({ async: true })
@Injectable()
export class CityExistsConstraint implements ValidatorConstraintInterface {
  private chain: CityHandler;

  constructor(
    private readonly weatherApiHandler: WeatherApiHandler,
    private readonly openweatherHandler: OpenWeatherHandler,
  ) {
    this.chain = weatherApiHandler;
    this.weatherApiHandler.setNext(openweatherHandler);
  }

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
