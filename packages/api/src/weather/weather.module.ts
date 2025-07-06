import { Module } from '@nestjs/common';
import { WeatherProviderAdapter } from 'src/common/adapters/weather-povider.adapter';
import { WeatherProviderLoggingDecorator } from 'src/common/decorators/weather-provider-logging.decorator';
import { LoggerModule } from 'src/logger/logger.module';
import { LoggerService } from 'src/logger/logger.service';
import { WeatherProvider } from './interfaces/current-weather.abstract';
import { OpenWeatherWeatherProvider } from './providers/openweather.provider';
import { WeatherApiWeatherProvider } from './providers/weatherapi.provider';
import { WeatherController } from './weather.controller';

@Module({
  imports: [LoggerModule],
  controllers: [WeatherController],
  providers: [
    WeatherApiWeatherProvider,
    OpenWeatherWeatherProvider,
    {
      provide: WeatherProvider,
      inject: [WeatherApiWeatherProvider, OpenWeatherWeatherProvider, LoggerService],
      useFactory: (weatherApiProvider: WeatherApiWeatherProvider, openWeatherProvider: OpenWeatherWeatherProvider, logger: LoggerService) => {
        const decoratedWeatherAPI = new WeatherProviderLoggingDecorator(weatherApiProvider, logger);
        const decoratedOpenWeather = new WeatherProviderLoggingDecorator(openWeatherProvider, logger);
        const chain = decoratedWeatherAPI.setNext(decoratedOpenWeather);

        return new WeatherProviderAdapter(chain);
      },
    },
  ],
  exports: [WeatherProvider],
})
export class WeatherModule {}
