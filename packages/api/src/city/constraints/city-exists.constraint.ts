import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ProviderHandler } from 'src/common/interfaces/weather-handler.interface';
import { OpenWeatherHandler } from '../handlers/city-openweather.handler';
import { WeatherApiHandler } from '../handlers/city-weatherapi.handler';

@ValidatorConstraint({ async: true })
@Injectable()
export class CityExistsConstraint implements ValidatorConstraintInterface {
  private chain: ProviderHandler<void>;

  constructor(
    private readonly weatherApiHandler: WeatherApiHandler,
    private readonly openweatherHandler: OpenWeatherHandler,
  ) {
    this.chain = weatherApiHandler.setNext(openweatherHandler);
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
