import { Injectable } from '@nestjs/common';
import { ProviderLoggingDecorator } from 'src/common/decorators/provider-logging.decorator';
import { Chainable } from 'src/common/interfaces/weather-handler.abstract';
import { LoggerService } from 'src/logger/logger.service';
import { OpenWeatherCityValidation } from '../providers/openweather.provider';
import { WeatherApiCityValidation } from '../providers/weatherapi.provider';

export const CityProviderChain = 'CityProviderChain';

@Injectable()
export class CityValidationFactory {
  private readonly loggerMessage: string = 'City validation';

  constructor(
    private readonly openWeatherProvider: OpenWeatherCityValidation,
    private readonly weatherApiProvider: WeatherApiCityValidation,
    private readonly logger: LoggerService,
  ) {}

  create(): Chainable<string, boolean> {
    const decoratedWeatherAPI = new ProviderLoggingDecorator<string, boolean>(this.weatherApiProvider, this.logger, this.loggerMessage);
    const decoratedOpenWeather = new ProviderLoggingDecorator<string, boolean>(this.openWeatherProvider, this.logger, this.loggerMessage);

    return decoratedWeatherAPI.setNext(decoratedOpenWeather);
  }
}
