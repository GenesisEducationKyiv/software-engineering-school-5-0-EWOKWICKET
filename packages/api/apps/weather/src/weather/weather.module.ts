import { Module } from '@nestjs/common';
import { ProviderLogger } from 'libs/logger/src/application/interfaces/logger.interface';
import { LoggerModule } from 'libs/logger/src/logger.module';
import { CacheAccessor } from 'src/cache/application/interfaces/cache-service.interface';
import { CacheModule } from 'src/cache/cache.module';
import { WeatherProvider } from './application/interfaces/weather-provider.abstract';
import { OpenWeatherWeatherProvider } from './infrastructure/providers/openweather.provider';
import { WeatherApiWeatherProvider } from './infrastructure/providers/weatherapi.provider';
import { WeatherProviderCacheProxy } from './infrastructure/wrappers/weather-cache.proxy';
import { WeatherProviderAdapter } from './infrastructure/wrappers/weather-povider.adapter';
import { WeatherProviderLoggingDecorator } from './infrastructure/wrappers/weather-provider-logging.decorator';
import { WeatherController } from './presentation/weather.controller';

@Module({
  imports: [LoggerModule, CacheModule],
  controllers: [WeatherController],
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
export class WeatherModule {}
