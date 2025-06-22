import { Module } from '@nestjs/common';
import { CurrentOpenWeatherHandler } from './handlers/weather-openweather.handler';
import { CurrentWeatherApiHandler } from './handlers/weather-weatherapi.handler';
import { WeatherServiceInterface } from './interfaces/current-weather.interface';
import { WeatherFetch } from './interfaces/weather-fetch.interface';
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
