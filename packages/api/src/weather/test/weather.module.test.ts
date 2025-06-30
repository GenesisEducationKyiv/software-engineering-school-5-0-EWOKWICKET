import { Module } from '@nestjs/common';
import { LoggerTestModule } from 'src/logger/test/logger.module.test';
import { CurrentOpenWeatherHandler } from '../handlers/weather-openweather.handler';
import { CurrentWeatherApiHandler } from '../handlers/weather-weatherapi.handler';
import { WeatherServiceInterface } from '../interfaces/current-weather.abstract';
import { WeatherFetch } from '../interfaces/weather-fetch.abstract';
import { WeatherFetchService } from '../services/weather-fetch.service';
import { WeatherService } from '../services/weather.service';
import { WeatherController } from '../weather.controller';

@Module({
  imports: [LoggerTestModule],
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
export class WeatherTestModule {}
