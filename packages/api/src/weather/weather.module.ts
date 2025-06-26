import { Module } from '@nestjs/common';
import { CacheModule } from 'src/cache/cache.module';
import { LoggerModule } from 'src/logger/logger.module';
import { WeatherProviderFactory } from './factories/weather-provider.factory';
import { WeatherProvider } from './interfaces/current-weather.abstract';
import { OpenWeatherWeatherProvider } from './providers/openweather.provider';
import { WeatherApiWeatherProvider } from './providers/weatherapi.provider';
import { WeatherController } from './weather.controller';

@Module({
  imports: [LoggerModule, CacheModule],
  controllers: [WeatherController],
  providers: [
    WeatherProviderFactory,
    WeatherApiWeatherProvider,
    OpenWeatherWeatherProvider,
    {
      provide: WeatherProvider,
      inject: [WeatherProviderFactory],
      useFactory: (weatherFactory: WeatherProviderFactory) => weatherFactory.create(),
    },
  ],
  exports: [WeatherProvider],
})
export class WeatherModule {}
