import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CacheTestModule } from 'src/cache/test/cache.module.test';
import { WeatherProviderAdapter } from 'src/common/adapters/weather-povider.adapter';
import { WeatherProvider } from '../interfaces/current-weather.abstract';
import { OpenWeatherWeatherProvider } from '../providers/openweather.provider';
import { WeatherApiWeatherProvider } from '../providers/weatherapi.provider';
import { WeatherController } from '../weather.controller';

@Module({
  imports: [HttpModule.register({}), CacheTestModule],
  controllers: [WeatherController],
  providers: [
    WeatherApiWeatherProvider,
    OpenWeatherWeatherProvider,
    {
      provide: WeatherProvider,
      useFactory: (provider1: WeatherApiWeatherProvider, provider2: OpenWeatherWeatherProvider) => {
        return new WeatherProviderAdapter(provider1.setNext(provider2));
      },
      inject: [WeatherApiWeatherProvider, OpenWeatherWeatherProvider],
    },
  ],
  exports: [WeatherProvider],
})
export class WeatherTestModule {}
