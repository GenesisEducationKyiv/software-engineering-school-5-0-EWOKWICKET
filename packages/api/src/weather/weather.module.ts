import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/logger/logger.module';
import { WeatherProviderFactory } from './factories/weather-provider.factory';
import { ChainableCurrentWeatherProvider } from './interfaces/chainable-weather-provider.abstract';
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
    WeatherProviderFactory,
    {
      provide: ChainableCurrentWeatherProvider,
      useFactory: (weatherFactory: WeatherProviderFactory) => {
        return weatherFactory.create();
      },
      inject: [WeatherProviderFactory],
    },
    WeatherApiWeatherProvider,
    OpenWeatherWeatherProvider,
  ],
  exports: [WeatherProvider],
})
export class WeatherModule {}
