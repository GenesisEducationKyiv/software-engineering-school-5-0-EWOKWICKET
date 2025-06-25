import { Module } from '@nestjs/common';
import { WeatherServiceInterface } from './abstractions/current-weather.abstract';
import { WeatherFetch } from './abstractions/weather-fetch.abstract';
import { CurrentOpenWeatherHandler } from './handlers/weather-openweather.handler';
import { CurrentWeatherApiHandler } from './handlers/weather-weatherapi.handler';
import { WeatherFetchService } from './services/weather-fetch.service';
import { WeatherService } from './services/weather.service';
import { WeatherController } from './weather.controller';

@Module({
  controllers: [WeatherController],
  providers: [
    {
      provide: WeatherServiceInterface,
      useClass: WeatherService,
    },
    {
      provide: WeatherFetch,
      useClass: WeatherFetchService,
    },
    CurrentWeatherApiHandler,
    CurrentOpenWeatherHandler,
  ],
  exports: [WeatherServiceInterface],
})
export class WeatherModule {}
