import { Injectable } from '@nestjs/common';
import { ProviderLoggingDecorator } from 'src/common/decorators/provider-logging.decorator';
import { Chainable } from 'src/common/interfaces/weather-handler.abstract';
import { LoggerService } from 'src/logger/logger.service';
import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';
import { CurrentOpenWeatherHandler } from '../handlers/weather-openweather.handler';
import { CurrentWeatherApiHandler } from '../handlers/weather-weatherapi.handler';

export const ProviderChain = 'ProviderChain';

@Injectable()
export class WeatherFactory {
  private readonly loggerMessage: string = 'Current weather';

  constructor(
    private readonly openWeatherProvider: CurrentOpenWeatherHandler,
    private readonly weatherApiProvider: CurrentWeatherApiHandler,
    private readonly logger: LoggerService,
  ) {}

  create(): Chainable<CurrentWeatherResponseDto> {
    const decoratedWeatherAPI = new ProviderLoggingDecorator(this.weatherApiProvider, this.logger, this.loggerMessage);
    const decoratedOpenWeather = new ProviderLoggingDecorator(this.openWeatherProvider, this.logger, this.loggerMessage);

    decoratedWeatherAPI.setNext(decoratedOpenWeather);

    return decoratedWeatherAPI;
  }
}
