import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/logger/logger.module';
import { WeatherFactory, WeatherProviderChain } from './factories/weather.factory';
import { WeatherProvider } from './interfaces/current-weather.abstract';
import { OpenWeatherWeatherProvider } from './providers/openweather.provider';
import { WeatherApiWeatherProvider } from './providers/weatherapi.provider';
import { WeatherService } from './services/weather.service';
import { WeatherController } from './weather.controller';

@Module({
  imports: [HttpModule.register({}), LoggerModule],
  controllers: [WeatherController],
  providers: [
    {
      provide: WeatherProvider,
      useClass: WeatherService,
    },
    WeatherFactory,
    {
      provide: WeatherProviderChain,
      useFactory: (weatherFactory: WeatherFactory) => {
        return weatherFactory.create();
      },
      inject: [WeatherFactory],
    },
    WeatherApiWeatherProvider,
    OpenWeatherWeatherProvider,
  ],
  exports: [WeatherProvider],
})
export class WeatherModule {}
