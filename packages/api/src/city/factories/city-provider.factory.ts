import { Injectable } from '@nestjs/common';
import { CacheServiceInterface } from 'src/cache/interfaces/cache-service.interface';
import { CityProviderAdapter } from 'src/common/adapters/city-provider.adapter';
import { CityProviderLoggingDecorator } from 'src/common/decorators/city-provider-logging.decorator';
import { CityProviderCacheProxy } from 'src/common/proxies/city-validation-cache.proxy';
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
    private readonly cacheService: CacheServiceInterface,
  ) {}

  create(): CityProvider {
    const decoratedWeatherAPI = new CityProviderLoggingDecorator(this.weatherApiProvider, this.logger);
    const decoratedOpenWeather = new CityProviderLoggingDecorator(this.openWeatherProvider, this.logger);
    const cacheProxied = new CityProviderCacheProxy(decoratedWeatherAPI.setNext(decoratedOpenWeather), this.cacheService);

    return new CityProviderAdapter(cacheProxied);
  }
}
