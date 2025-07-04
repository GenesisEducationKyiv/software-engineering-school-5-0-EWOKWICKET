import { Module } from '@nestjs/common';
import { CacheModule } from 'src/cache/cache.module';
import { CacheService } from 'src/cache/cache.service';
import { CityProviderAdapter } from 'src/common/adapters/city-provider.adapter';
import { CityProviderLoggingDecorator } from 'src/common/decorators/city-provider-logging.decorator';
import { CityProviderCacheProxy } from 'src/common/proxies/city-validation-cache.proxy';
import { LoggerModule } from 'src/logger/logger.module';
import { LoggerService } from 'src/logger/logger.service';
import { CityExistsConstraint } from './city-exists.constraint';
import { CityProvider } from './interfaces/city.provider';
import { OpenWeatherCityProvider } from './providers/openweather.provider';
import { WeatherApiCityProvider } from './providers/weatherapi.provider';

@Module({
  imports: [LoggerModule, CacheModule],
  providers: [
    CityExistsConstraint,
    WeatherApiCityProvider,
    OpenWeatherCityProvider,
    {
      provide: CityProvider,
      inject: [WeatherApiCityProvider, OpenWeatherCityProvider, LoggerService, CacheService],
      useFactory: (weatherApiProvider: WeatherApiCityProvider, openWeatherProvider: OpenWeatherCityProvider, logger: LoggerService, cacheService: CacheService) => {
        const decoratedWeatherAPI = new CityProviderLoggingDecorator(weatherApiProvider, logger);
        const decoratedOpenWeather = new CityProviderLoggingDecorator(openWeatherProvider, logger);
        const cachProxied = new CityProviderCacheProxy(decoratedWeatherAPI.setNext(decoratedOpenWeather), cacheService);

        return new CityProviderAdapter(cachProxied);
      },
    },
  ],
  exports: [CityExistsConstraint],
})
export class CityModule {}
