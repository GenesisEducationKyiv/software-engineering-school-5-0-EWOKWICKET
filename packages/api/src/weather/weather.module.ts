import { Module } from '@nestjs/common';
import { WeatherApiService } from './services/weather-api.service';
import { WeatherService } from './services/weather.service';
import { WeatherController } from './weather.controller';

@Module({
  controllers: [WeatherController],
  providers: [WeatherService, WeatherApiService],
  exports: [WeatherService],
})
export class WeatherModule {}
