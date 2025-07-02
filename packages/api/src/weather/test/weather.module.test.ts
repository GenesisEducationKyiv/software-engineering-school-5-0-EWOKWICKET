import { Module } from '@nestjs/common';
import { CurrentWeather } from '../interfaces/current-weather.interface';
import { WeatherFetch } from '../interfaces/weather-fetch.interface';
import { WeatherFetchService } from '../services/weather-fetch.service';
import { WeatherService } from '../services/weather.service';
import { WeatherController } from '../weather.controller';

@Module({
  controllers: [WeatherController],
  providers: [
    {
      provide: CurrentWeather,
      useClass: WeatherService,
    },
    {
      provide: WeatherFetch,
      useClass: WeatherFetchService,
    },
  ],
  exports: [CurrentWeather],
})
export class WeatherTestModule {}
