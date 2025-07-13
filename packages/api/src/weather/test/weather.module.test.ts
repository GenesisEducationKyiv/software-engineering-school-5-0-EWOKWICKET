import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WeatherController } from '../../gateway/weather/weather.controller';
import { WeatherProvider } from '../weather/application/interfaces/weather-provider.abstract';
import { OpenWeatherWeatherProvider } from '../weather/infrastructure/providers/openweather.provider';
import { WeatherApiWeatherProvider } from '../weather/infrastructure/providers/weatherapi.provider';
import { WeatherProviderAdapter } from '../weather/infrastructure/wrappers/weather-povider.adapter';

@Module({
  imports: [HttpModule.register({})],
  controllers: [WeatherController],
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
export class WeatherTestModule {}
