import { Module } from '@nestjs/common';
import { CacheModule } from 'src/cache/cache.module';
import { CacheAccessor } from 'src/cache/interfaces/cache-service.interface';
import { CityProviderAdapter } from 'src/city/infrastructure/adapters/city-provider.adapter';
import { CityProviderLoggingDecorator } from 'src/city/infrastructure/decorators/city-provider-logging.decorator';
import { CityProviderCacheProxy } from 'src/city/infrastructure/proxies/city-provider-cache.proxy';
import { LoggerModule } from 'src/logger/logger.module';
import { LoggerService } from 'src/logger/logger.service';
import { CityExistsConstraint } from './city-exists.constraint';
=======
import { CacheModule } from 'src/cache/cache.module';
import { LoggerModule } from 'src/logger/logger.module';
import { CityExistsConstraint } from './city-exists.constraint';
import { CityProviderFactory } from './factories/city-provider.factory';
>>>>>>> 464b157 (merge bugs fixed)
import { CityProvider } from './interfaces/city.provider';
import { OpenWeatherCityProvider } from './providers/openweather.provider';
import { WeatherApiCityProvider } from './providers/weatherapi.provider';

@Module({
  imports: [LoggerModule, CacheModule],
  providers: [
    CityExistsConstraint,
    WeatherApiCityProvider,
    OpenWeatherCityProvider,
<<<<<<< HEAD
    {
      provide: CityProvider,
      inject: [WeatherApiCityProvider, OpenWeatherCityProvider, LoggerService, CacheAccessor],
      useFactory: (weatherApiProvider: WeatherApiCityProvider, openWeatherProvider: OpenWeatherCityProvider, logger: LoggerService, cacheService: CacheAccessor) => {
        const decoratedWeatherAPI = new CityProviderLoggingDecorator(weatherApiProvider, logger);
        const decoratedOpenWeather = new CityProviderLoggingDecorator(openWeatherProvider, logger);
        const cachProxied = new CityProviderCacheProxy(decoratedWeatherAPI.setNext(decoratedOpenWeather), cacheService);

        return new CityProviderAdapter(cachProxied);
      },
=======
    CityProviderFactory,
    {
      provide: CityProvider,
      inject: [CityProviderFactory],
      useFactory: (cityFactory: CityProviderFactory) => cityFactory.create(),
>>>>>>> 464b157 (merge bugs fixed)
    },
  ],
  exports: [CityExistsConstraint],
})
export class CityModule {}
