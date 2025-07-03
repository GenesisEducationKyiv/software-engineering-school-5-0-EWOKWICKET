import { Injectable } from '@nestjs/common';
import { CacheServiceInterface } from 'src/cache/interfaces/cache-service.interface';
import { WeatherProviderAdapter } from 'src/common/adapters/weather-povider.adapter';
import { WeatherProviderLoggingDecorator } from 'src/common/decorators/weather-provider-logging.decorator';
import { WeatherProviderCacheProxy } from 'src/common/proxies/weather-cache.proxy';
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
    private readonly cacheService: CacheServiceInterface,
  ) {}

  create(): WeatherProvider {
    const decoratedWeatherAPI = new WeatherProviderLoggingDecorator(this.weatherApiProvider, this.logger);
    const decoratedOpenWeather = new WeatherProviderLoggingDecorator(this.openWeatherProvider, this.logger);
    const cacheProxied = new WeatherProviderCacheProxy(decoratedWeatherAPI.setNext(decoratedOpenWeather), this.cacheService);

    return new WeatherProviderAdapter(cacheProxied);
  }
}
