import { Module } from '@nestjs/common';
import { WeatherApiServiceToken } from './interfaces/weather-api-service.interface';
import { ForecastWeatherServiceToken } from './interfaces/weather-service.interface';
import { WeatherApiService } from './services/weather-api.service';
import { WeatherService } from './services/weather.service';
import { WeatherController } from './weather.controller';

@Module({
  controllers: [WeatherController],
  providers: [
    WeatherService,
    WeatherApiService,
    {
      provide: ForecastWeatherServiceToken,
      useExisting: WeatherService,
    },
    {
      provide: WeatherApiServiceToken,
      useExisting: WeatherApiService,
    },
  ],
  exports: [ForecastWeatherServiceToken],
})
export class WeatherModule {}
