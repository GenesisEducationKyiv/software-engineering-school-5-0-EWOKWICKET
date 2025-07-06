import { Module } from '@nestjs/common';
import { CityProviderAdapter } from 'src/common/adapters/city-provider.adapter';
import { CityProviderLoggingDecorator } from 'src/common/decorators/city-provider-logging.decorator';
import { LoggerModule } from 'src/logger/logger.module';
import { LoggerService } from 'src/logger/logger.service';
import { CityExistsConstraint } from './city-exists.constraint';
import { CityProvider } from './interfaces/city.provider';
import { OpenWeatherCityProvider } from './providers/openweather.provider';
import { WeatherApiCityProvider } from './providers/weatherapi.provider';

@Module({
  imports: [LoggerModule],
  providers: [
    CityExistsConstraint,
    WeatherApiCityProvider,
    OpenWeatherCityProvider,
    {
      provide: CityProvider,
      inject: [WeatherApiCityProvider, OpenWeatherCityProvider, LoggerService],
      useFactory: (weatherApiProvider: WeatherApiCityProvider, openWeatherProvider: OpenWeatherCityProvider, logger: LoggerService) => {
        const decoratedWeatherAPI = new CityProviderLoggingDecorator(weatherApiProvider, logger);
        const decoratedOpenWeather = new CityProviderLoggingDecorator(openWeatherProvider, logger);
        const chain = decoratedWeatherAPI.setNext(decoratedOpenWeather);

        return new CityProviderAdapter(chain);
      },
    },
  ],
  exports: [CityExistsConstraint],
})
export class CityModule {}
