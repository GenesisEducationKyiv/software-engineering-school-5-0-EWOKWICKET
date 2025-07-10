import { Module } from '@nestjs/common';
import { CacheAccessor } from 'src/cache/application/interfaces/cache-service.interface';
import { CacheModule } from 'src/cache/cache.module';
import { ProviderLogger } from 'src/common/logger/interfaces/logger.interface';
import { LoggerModule } from 'src/common/logger/logger.module';
import { CityProvider } from './application/interfaces/city-provider.abstract';
import { CityExistsConstraint } from './application/validators/city-exists.constraint';
import { OpenWeatherCityProvider } from './infrastructure/providers/openweather.provider';
import { WeatherApiCityProvider } from './infrastructure/providers/weatherapi.provider';
import { CityProviderLoggingDecorator } from './infrastructure/wrappers/city-provider-logging.decorator';
import { CityProviderAdapter } from './infrastructure/wrappers/city-provider.adapter';
import { CityProviderCacheProxy } from './infrastructure/wrappers/city-validation-cache.proxy';

@Module({
  imports: [LoggerModule, CacheModule],
  providers: [
    CityExistsConstraint,
    WeatherApiCityProvider,
    OpenWeatherCityProvider,
    {
      provide: CityProvider,
      inject: [WeatherApiCityProvider, OpenWeatherCityProvider, ProviderLogger, CacheAccessor],
      useFactory: (weatherApiProvider: WeatherApiCityProvider, openWeatherProvider: OpenWeatherCityProvider, logger: ProviderLogger, cacheService: CacheAccessor) => {
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
