import { Module } from '@nestjs/common';
import { ProviderLogger } from 'src/common/logger/interfaces/logger.interface';
import { LoggerModule } from 'src/common/logger/logger.module';
import { CacheAccessor } from '../cache/application/interfaces/cache-service.interface';
import { CacheModule } from '../cache/cache.module';
import { WeatherProvider } from './application/interfaces/weather-provider.abstract';
import { OpenWeatherWeatherProvider } from './infrastructure/providers/openweather.provider';
import { WeatherApiWeatherProvider } from './infrastructure/providers/weatherapi.provider';
import { WeatherProviderCacheProxy } from './infrastructure/wrappers/weather-cache.proxy';
import { WeatherProviderAdapter } from './infrastructure/wrappers/weather-povider.adapter';
import { WeatherProviderLoggingDecorator } from './infrastructure/wrappers/weather-provider-logging.decorator';

@Module({
  imports: [LoggerModule, CacheModule],
  providers: [
    WeatherApiWeatherProvider,
    OpenWeatherWeatherProvider,
    {
      provide: WeatherProvider,
      inject: [WeatherApiWeatherProvider, OpenWeatherWeatherProvider, ProviderLogger, CacheAccessor],
      useFactory: (weatherApiProvider: WeatherApiWeatherProvider, openWeatherProvider: OpenWeatherWeatherProvider, logger: ProviderLogger, cacheService: CacheAccessor) => {
        const decoratedWeatherAPI = new WeatherProviderLoggingDecorator(weatherApiProvider, logger);
        const decoratedOpenWeather = new WeatherProviderLoggingDecorator(openWeatherProvider, logger);
        const cacheProxied = new WeatherProviderCacheProxy(decoratedWeatherAPI.setNext(decoratedOpenWeather), cacheService);

        return new WeatherProviderAdapter(cacheProxied);
      },
    },
  ],
  exports: [WeatherProvider],
})
export class WeatherAPIModule {}
