import { Injectable } from '@nestjs/common';
import { WeatherProviderAdapter } from 'src/common/adapters/weather-povider.adapter';
import { WeatherProviderLoggingDecorator } from 'src/common/decorators/weather-provider-logging.decorator';
import { LoggerService } from 'src/logger/logger.service';
import { WeatherProvider } from '../interfaces/current-weather.abstract';
import { OpenWeatherWeatherProvider } from '../providers/openweather.provider';
import { WeatherApiWeatherProvider } from '../providers/weatherapi.provider';

@Injectable()
export class WeatherProviderFactory {
  constructor(
    private readonly openWeatherProvider: OpenWeatherWeatherProvider,
    private readonly weatherApiProvider: WeatherApiWeatherProvider,
    private readonly logger: LoggerService,
  ) {}

  create(): WeatherProvider {
    const decoratedWeatherAPI = new WeatherProviderLoggingDecorator(this.weatherApiProvider, this.logger);
    const decoratedOpenWeather = new WeatherProviderLoggingDecorator(this.openWeatherProvider, this.logger);
    const chain = decoratedWeatherAPI.setNext(decoratedOpenWeather);

    return new WeatherProviderAdapter(chain);
  }
}
