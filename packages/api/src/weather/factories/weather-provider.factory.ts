import { Injectable } from '@nestjs/common';
import { WeatherProviderLoggingDecorator } from 'src/common/decorators/weather-provider-logging.decorator';
import { LoggerService } from 'src/logger/logger.service';
import { ChainableCurrentWeatherProvider } from '../interfaces/chainable-weather-provider.abstract';
import { OpenWeatherWeatherProvider } from '../providers/openweather.provider';
import { WeatherApiWeatherProvider } from '../providers/weatherapi.provider';

@Injectable()
export class WeatherProviderFactory {
  constructor(
    private readonly openWeatherProvider: OpenWeatherWeatherProvider,
    private readonly weatherApiProvider: WeatherApiWeatherProvider,
    private readonly logger: LoggerService,
  ) {}

  create(): ChainableCurrentWeatherProvider {
    const decoratedWeatherAPI = new WeatherProviderLoggingDecorator(this.weatherApiProvider, this.logger);
    const decoratedOpenWeather = new WeatherProviderLoggingDecorator(this.openWeatherProvider, this.logger);

    return decoratedWeatherAPI.setNext(decoratedOpenWeather);
  }
}
