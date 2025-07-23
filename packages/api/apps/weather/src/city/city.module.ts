import { CacheAccessor } from '@cache/application/interfaces/cache-service.interface';
import { CacheModule } from '@cache/cache.module';
import { Module } from '@nestjs/common';
import { ProviderLogger } from 'libs/logger/src/application/interfaces/logger.interface';
import { LoggerModule } from 'libs/logger/src/logger.module';
import { CityProvider } from './application/interfaces/city-provider.abstract';
import { OpenWeatherCityProvider } from './infrastructure/providers/openweather.provider';
import { WeatherApiCityProvider } from './infrastructure/providers/weatherapi.provider';
import { CityProviderLoggingDecorator } from './infrastructure/wrappers/city-provider-logging.decorator';
import { CityProviderAdapter } from './infrastructure/wrappers/city-provider.adapter';
import { CityProviderCacheProxy } from './infrastructure/wrappers/city-validation-cache.proxy';
import { CityController } from './presentation/city.controller';

@Module({
  imports: [LoggerModule, CacheModule],
  controllers: [CityController],
  providers: [
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
  exports: [CityProvider],
})
export class CityModule {}
