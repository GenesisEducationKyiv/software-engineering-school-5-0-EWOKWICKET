import { Module } from '@nestjs/common';
import { LoggerTestModule } from 'src/logger/test/logger.module.test';
import { WeatherProvider } from '../interfaces/current-weather.abstract';
import { OpenWeatherWeatherProvider } from '../providers/openweather.provider';
import { WeatherApiWeatherProvider } from '../providers/weatherapi.provider';
import { WeatherService } from '../services/weather.service';
import { WeatherController } from '../weather.controller';

@Module({
  imports: [LoggerTestModule],
  controllers: [WeatherController],
  providers: [
    {
      provide: WeatherProvider,
      useClass: WeatherService,
    },
    WeatherApiWeatherProvider,
    OpenWeatherWeatherProvider,
  ],
  exports: [WeatherProvider],
})
export class WeatherTestModule {}
