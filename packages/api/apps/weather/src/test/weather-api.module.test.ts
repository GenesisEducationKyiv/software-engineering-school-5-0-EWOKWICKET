import { Module } from '@nestjs/common';
import { WeatherProvider } from '../weather-api/application/interfaces/weather-provider.abstract';
import { OpenWeatherWeatherProvider } from '../weather-api/infrastructure/providers/openweather.provider';
import { WeatherApiWeatherProvider } from '../weather-api/infrastructure/providers/weatherapi.provider';
import { WeatherProviderAdapter } from '../weather-api/infrastructure/wrappers/weather-povider.adapter';

@Module({
  providers: [
    WeatherApiWeatherProvider,
    OpenWeatherWeatherProvider,
    {
      provide: WeatherProvider,
      useFactory: (provider1: WeatherApiWeatherProvider, provider2: OpenWeatherWeatherProvider) => {
        return new WeatherProviderAdapter(provider1.setNext(provider2));
      },
      inject: [WeatherApiWeatherProvider, OpenWeatherWeatherProvider],
    },
  ],
  exports: [WeatherProvider],
})
export class WeatherAPITestModule {}
