import { CacheAccessor } from '@cache/application/interfaces/cache-service.interface';
import { CacheModule } from '@cache/cache.module';
import { LoggerModule } from '@logger/logger.module';
import { Module } from '@nestjs/common';
import { LoggerInterface } from 'libs/logger/src/application/interfaces/logger.interface';
import { WeatherProvider } from './application/interfaces/weather-provider.abstract';
import { OpenWeatherWeatherProvider } from './infrastructure/providers/openweather.provider';
import { WeatherApiWeatherProvider } from './infrastructure/providers/weatherapi.provider';
import { WeatherProviderCacheProxy } from './infrastructure/wrappers/weather-cache.proxy';
import { WeatherProviderAdapter } from './infrastructure/wrappers/weather-povider.adapter';
import { WeatherProviderLoggingDecorator } from './infrastructure/wrappers/weather-provider-logging.decorator';
import { WeatherController } from './presentation/weather.controller';

@Module({
  imports: [CacheModule, LoggerModule],
  controllers: [WeatherController],
  providers: [
    WeatherApiWeatherProvider,
    OpenWeatherWeatherProvider,
    {
      provide: WeatherProvider,
      inject: [WeatherApiWeatherProvider, OpenWeatherWeatherProvider, LoggerInterface, CacheAccessor],
      useFactory: (weatherApiProvider: WeatherApiWeatherProvider, openWeatherProvider: OpenWeatherWeatherProvider, logger: LoggerInterface, cacheService: CacheAccessor) => {
        const decoratedWeatherAPI = new WeatherProviderLoggingDecorator(weatherApiProvider, logger, { labels: { provider: 'WeatherApi' } });
        const decoratedOpenWeather = new WeatherProviderLoggingDecorator(openWeatherProvider, logger, { labels: { provider: 'OpenWeather' } });
        const cacheProxied = new WeatherProviderCacheProxy(decoratedWeatherAPI.setNext(decoratedOpenWeather), cacheService);

        return new WeatherProviderAdapter(cacheProxied);
      },
    },
  ],
  exports: [WeatherProvider],
})
export class WeatherModule {}
