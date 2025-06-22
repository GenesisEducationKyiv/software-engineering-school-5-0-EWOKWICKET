import { Module } from '@nestjs/common';
import { OpenWeatherHandler } from './handlers/weather.openweather.handler';
import { WeatherApiHandler } from './handlers/weather.weatherapi.handler';
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
    WeatherApiHandler,
    OpenWeatherHandler,
  ],
  exports: [WeatherServiceInterface],
})
export class WeatherModule {}
