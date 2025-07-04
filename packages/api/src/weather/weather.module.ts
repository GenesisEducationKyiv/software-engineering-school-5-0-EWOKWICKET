import { Module } from '@nestjs/common';
import { CacheModule } from 'src/cache/cache.module';
import { CacheServiceInterface } from 'src/cache/interfaces/cache-service.interface';
import { WeatherProviderAdapter } from 'src/common/adapters/weather-povider.adapter';
import { WeatherProviderLoggingDecorator } from 'src/common/decorators/weather-provider-logging.decorator';
import { WeatherProviderCacheProxy } from 'src/common/proxies/weather-cache.proxy';
import { LoggerModule } from 'src/logger/logger.module';
import { LoggerService } from 'src/logger/logger.service';
import { WeatherProvider } from './interfaces/current-weather.abstract';
import { OpenWeatherWeatherProvider } from './providers/openweather.provider';
import { WeatherApiWeatherProvider } from './providers/weatherapi.provider';
import { WeatherController } from './weather.controller';

@Module({
  imports: [LoggerModule, CacheModule],
  controllers: [WeatherController],
  providers: [
    WeatherApiWeatherProvider,
    OpenWeatherWeatherProvider,
    {
      provide: WeatherProvider,
      inject: [WeatherApiWeatherProvider, OpenWeatherWeatherProvider, LoggerService, CacheServiceInterface],
      useFactory: (weatherApiProvider: WeatherApiWeatherProvider, openWeatherProvider: OpenWeatherWeatherProvider, logger: LoggerService, cacheService: CacheServiceInterface) => {
        const decoratedWeatherAPI = new WeatherProviderLoggingDecorator(weatherApiProvider, logger);
        const decoratedOpenWeather = new WeatherProviderLoggingDecorator(openWeatherProvider, logger);
        const cachProxied = new WeatherProviderCacheProxy(decoratedWeatherAPI.setNext(decoratedOpenWeather), cacheService);

        return new WeatherProviderAdapter(cachProxied);
      },
    },
  ],
  exports: [WeatherProvider],
})
export class WeatherModule {}
