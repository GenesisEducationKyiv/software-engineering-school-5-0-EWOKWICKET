import { Module } from '@nestjs/common';
import { CacheModule } from 'src/infrastructure/cache/cache.module';
import { CacheAccessor } from 'src/infrastructure/cache/interfaces/cache-service.interface';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { OpenWeatherWeatherProvider } from 'src/infrastructure/weather/providers/openweather.provider';
import { WeatherApiWeatherProvider } from 'src/infrastructure/weather/providers/weatherapi.provider';
import { WeatherProviderCacheProxy } from 'src/infrastructure/weather/wrappers/weather-cache.proxy';
import { WeatherProviderAdapter } from 'src/infrastructure/weather/wrappers/weather-povider.adapter';
import { WeatherProviderLoggingDecorator } from 'src/infrastructure/weather/wrappers/weather-provider-logging.decorator';
import { WeatherController } from 'src/presentation/weather.controller';
import { WeatherProvider } from './interfaces/weather-provider.abstract';

@Module({
  imports: [LoggerModule, CacheModule],
  controllers: [WeatherController],
  providers: [
    WeatherApiWeatherProvider,
    OpenWeatherWeatherProvider,
    {
      provide: WeatherProvider,
      inject: [WeatherApiWeatherProvider, OpenWeatherWeatherProvider, LoggerService, CacheAccessor],
      useFactory: (weatherApiProvider: WeatherApiWeatherProvider, openWeatherProvider: OpenWeatherWeatherProvider, logger: LoggerService, cacheService: CacheAccessor) => {
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
