import { Module } from '@nestjs/common';
import { CacheTestModule } from 'src/cache/test/cache.module.test';
import { LoggerTestModule } from 'src/logger/test/logger.module.test';
import { WeatherServiceInterface } from '../abstractions/current-weather.abstract';
import { WeatherFetch } from '../abstractions/weather-fetch.abstract';
import { CurrentOpenWeatherHandler } from '../handlers/weather-openweather.handler';
import { CurrentWeatherApiHandler } from '../handlers/weather-weatherapi.handler';
import { WeatherFetchService } from '../services/weather-fetch.service';
import { WeatherService } from '../services/weather.service';
import { WeatherController } from '../weather.controller';

@Module({
  imports: [LoggerTestModule, CacheTestModule],
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
