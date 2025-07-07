import { Module } from '@nestjs/common';
import { WeatherProvider } from 'src/domain/weather/interfaces/weather-provider.abstract';
import { CacheModule } from 'src/infrastructure/cache/cache.module';
import { CacheAccessor } from 'src/infrastructure/cache/interfaces/cache-service.interface';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { WeatherProviderAdapter } from 'src/infrastructure/weather/adapters/weather-povider.adapter';
import { WeatherProviderLoggingDecorator } from 'src/infrastructure/weather/decorators/weather-provider-logging.decorator';
import { OpenWeatherWeatherProvider } from 'src/infrastructure/weather/providers/openweather.provider';
import { WeatherApiWeatherProvider } from 'src/infrastructure/weather/providers/weatherapi.provider';
import { WeatherProviderCacheProxy } from 'src/infrastructure/weather/proxies/weather-cache.proxy';
import { WeatherController } from 'src/presentation/weather.controller';

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
