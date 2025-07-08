import { Module } from '@nestjs/common';
import { CacheAccessor } from 'src/common/interfaces/cache-service.interface';
import { ProviderLogger } from 'src/common/interfaces/logger.interface';
import { CacheModule } from 'src/infrastructure/cache/cache.module';
import { CityProviderLoggingDecorator } from 'src/infrastructure/city/wrappers/city-provider-logging.decorator';
import { CityProviderAdapter } from 'src/infrastructure/city/wrappers/city-provider.adapter';
import { CityProviderCacheProxy } from 'src/infrastructure/city/wrappers/city-validation-cache.proxy';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { CityProvider } from '../../application/city/interfaces/city-provider.abstract';
import { CityExistsConstraint } from '../../application/city/validators/city-exists.constraint';
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
