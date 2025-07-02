import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ChainableCurrentWeatherProvider } from '../interfaces/chainable-weather-provider.abstract';
import { WeatherProvider } from '../interfaces/current-weather.abstract';
import { OpenWeatherWeatherProvider } from '../providers/openweather.provider';
import { WeatherApiWeatherProvider } from '../providers/weatherapi.provider';
import { WeatherService } from '../services/weather.service';
import { WeatherController } from '../weather.controller';

@Module({
  imports: [HttpModule.register({})],
  controllers: [WeatherController],
  providers: [
    {
      provide: WeatherProvider,
      useClass: WeatherService,
    },
    WeatherApiWeatherProvider,
    OpenWeatherWeatherProvider,
    {
      provide: ChainableCurrentWeatherProvider,
      useFactory: (provider1: WeatherApiWeatherProvider, provider2: OpenWeatherWeatherProvider) => {
        return provider1.setNext(provider2);
      },
      inject: [WeatherApiWeatherProvider, OpenWeatherWeatherProvider],
    },
  ],
  exports: [WeatherProvider],
})
export class WeatherTestModule {}
