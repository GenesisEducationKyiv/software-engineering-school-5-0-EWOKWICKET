import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ProviderLoggingDecorator } from 'src/common/decorators/provider-logging.decorator';
import { Chainable } from 'src/common/interfaces/weather-handler.abstract';
import { LoggerService } from 'src/logger/logger.service';
import { CityOpenWeatherHandler } from '../handlers/city-openweather.handler';
import { CityWeatherApiHandler } from '../handlers/city-weatherapi.handler';

@ValidatorConstraint({ async: true })
@Injectable()
export class CityExistsConstraint implements ValidatorConstraintInterface {
  private chain: Chainable<void>;
  private readonly loggerMessage: string = 'City validation';

  constructor(
    private readonly logger: LoggerService,
    private readonly weatherApiHandler: CityWeatherApiHandler,
    private readonly openweatherHandler: CityOpenWeatherHandler,
  ) {
    const decoratedWeatherAPI = new ProviderLoggingDecorator(weatherApiHandler, logger, this.loggerMessage);
    const decoratedOpenWeather = new ProviderLoggingDecorator(openweatherHandler, logger, this.loggerMessage);

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
