import { Injectable } from '@nestjs/common';
import { CityProviderAdapter } from 'src/common/adapters/city-provider.adapter';
import { CityProviderLoggingDecorator } from 'src/common/decorators/city-provider-logging.decorator';
import { LoggerService } from 'src/logger/logger.service';
import { CityProvider } from '../interfaces/city.provider';
import { OpenWeatherCityProvider } from '../providers/openweather.provider';
import { WeatherApiCityProvider } from '../providers/weatherapi.provider';

@Injectable()
export class CityProviderFactory {
  constructor(
    private readonly openWeatherProvider: OpenWeatherCityProvider,
    private readonly weatherApiProvider: WeatherApiCityProvider,
    private readonly logger: LoggerService,
  ) {}

  create(): CityProvider {
    const decoratedWeatherAPI = new CityProviderLoggingDecorator(this.weatherApiProvider, this.logger);
    const decoratedOpenWeather = new CityProviderLoggingDecorator(this.openWeatherProvider, this.logger);
    const chain = decoratedWeatherAPI.setNext(decoratedOpenWeather);

    return new CityProviderAdapter(chain);
  }
}
