import { Module } from '@nestjs/common';
import { CacheModule } from 'src/infrastructure/cache/cache.module';
import { CacheAccessor } from 'src/infrastructure/cache/interfaces/cache-service.interface';
import { CityProviderLoggingDecorator } from 'src/infrastructure/city/wrappers/city-provider-logging.decorator';
import { CityProviderAdapter } from 'src/infrastructure/city/wrappers/city-provider.adapter';
import { CityProviderCacheProxy } from 'src/infrastructure/city/wrappers/city-validation-cache.proxy';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { OpenWeatherCityProvider } from '../../infrastructure/city/providers/openweather.provider';
import { WeatherApiCityProvider } from '../../infrastructure/city/providers/weatherapi.provider';
import { CityProvider } from './interfaces/city-provider.abstract';
import { CityExistsConstraint } from './validators/city-exists.constraint';

@Module({
  imports: [LoggerModule, CacheModule],
  providers: [
    CityExistsConstraint,
    WeatherApiCityProvider,
    OpenWeatherCityProvider,
    {
      provide: CityProvider,
      inject: [WeatherApiCityProvider, OpenWeatherCityProvider, LoggerService, CacheAccessor],
      useFactory: (weatherApiProvider: WeatherApiCityProvider, openWeatherProvider: OpenWeatherCityProvider, logger: LoggerService, cacheService: CacheAccessor) => {
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
