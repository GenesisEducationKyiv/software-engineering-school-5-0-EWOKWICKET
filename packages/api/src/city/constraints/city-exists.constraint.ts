import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ProviderLoggingDecorator } from 'src/common/decorators/weather-provider.decorator';
import { ProviderHandler } from 'src/common/interfaces/weather-handler.interface';
import { CityOpenWeatherHandler } from '../handlers/city-openweather.handler';
import { CityWeatherApiHandler } from '../handlers/city-weatherapi.handler';

@ValidatorConstraint({ async: true })
@Injectable()
export class CityExistsConstraint implements ValidatorConstraintInterface {
  private chain: ProviderHandler<void>;

  constructor(
    private readonly weatherApiHandler: CityWeatherApiHandler,
    private readonly openweatherHandler: CityOpenWeatherHandler,
  ) {
    const decoratedWeatherAPI = new ProviderLoggingDecorator(weatherApiHandler);
    const decoratedOpenWeather = new ProviderLoggingDecorator(openweatherHandler);

    this.chain = decoratedWeatherAPI.setNext(decoratedOpenWeather);
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
