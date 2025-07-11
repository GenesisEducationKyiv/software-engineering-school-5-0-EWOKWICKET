import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WeatherProvider } from './application/interfaces/weather-provider.abstract';
import { OpenWeatherWeatherProvider } from './infrastructure/providers/openweather.provider';
import { WeatherApiWeatherProvider } from './infrastructure/providers/weatherapi.provider';
import { WeatherProviderAdapter } from './infrastructure/wrappers/weather-povider.adapter';
import { WeatherController } from './presentation/weather.controller';

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
