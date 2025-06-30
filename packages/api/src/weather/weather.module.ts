import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/logger/logger.module';
import { CurrentOpenWeatherHandler } from './handlers/weather-openweather.handler';
import { CurrentWeatherApiHandler } from './handlers/weather-weatherapi.handler';
import { WeatherServiceInterface } from './interfaces/current-weather.abstract';
import { WeatherFetch } from './interfaces/weather-fetch.abstract';
import { WeatherFetchService } from './services/weather-fetch.service';
import { ProviderChain, WeatherFactory } from './services/weather.factory';
import { WeatherService } from './services/weather.service';
import { WeatherController } from './weather.controller';

@Module({
  imports: [LoggerModule],
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
    {
      provide: ProviderChain,
      useFactory: (weatherFactory: WeatherFactory) => {
        return weatherFactory.create();
      },
      inject: [WeatherFactory],
    },
    CurrentWeatherApiHandler,
    CurrentOpenWeatherHandler,
  ],
  exports: [WeatherServiceInterface],
})
export class WeatherModule {}
