import { Injectable } from '@nestjs/common';
import { ProviderLoggingDecorator } from 'src/common/decorators/provider-logging.decorator';
import { Chainable } from 'src/common/interfaces/weather-handler.abstract';
import { LoggerService } from 'src/logger/logger.service';
import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';
import { OpenWeatherWeatherProvider } from '../providers/openweather.provider';
import { WeatherApiWeatherProvider } from '../providers/weatherapi.provider';

export const WeatherProviderChain = 'WeatherProviderChain';

@Injectable()
export class WeatherFactory {
  private readonly loggerMessage: string = 'Current weather';

  constructor(
    private readonly openWeatherProvider: OpenWeatherWeatherProvider,
    private readonly weatherApiProvider: WeatherApiWeatherProvider,
    private readonly logger: LoggerService,
  ) {}

  create(): Chainable<string, CurrentWeatherResponseDto> {
    const decoratedWeatherAPI = new ProviderLoggingDecorator<string, CurrentWeatherResponseDto>(this.weatherApiProvider, this.logger, this.loggerMessage);
    const decoratedOpenWeather = new ProviderLoggingDecorator<string, CurrentWeatherResponseDto>(this.openWeatherProvider, this.logger, this.loggerMessage);

    return decoratedWeatherAPI.setNext(decoratedOpenWeather);
  }
}
