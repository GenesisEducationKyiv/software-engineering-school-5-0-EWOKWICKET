import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/logger/logger.module';
import { WeatherProviderFactory } from './factories/weather-provider.factory';
import { ChainableCurrentWeatherProvider } from './interfaces/chainable-weather-provider.abstract';
import { WeatherProvider } from './interfaces/current-weather.abstract';
import { OpenWeatherWeatherProvider } from './providers/openweather.provider';
import { WeatherApiWeatherProvider } from './providers/weatherapi.provider';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

@Module({
  imports: [LoggerModule],
  controllers: [WeatherController],
  providers: [
    {
      provide: WeatherProvider,
      useClass: WeatherService,
    },
    WeatherProviderFactory,
    WeatherApiWeatherProvider,
    OpenWeatherWeatherProvider,
    {
      provide: ChainableCurrentWeatherProvider,
      useFactory: (weatherFactory: WeatherProviderFactory) => {
        return weatherFactory.create();
      },
      inject: [WeatherProviderFactory],
    },
  ],
  exports: [WeatherProvider],
})
export class WeatherModule {}
