import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WeatherProvider } from 'src/domain/weather/interfaces/weather-provider.abstract';
import { WeatherProviderAdapter } from 'src/infrastructure/weather/adapters/weather-povider.adapter';
import { OpenWeatherWeatherProvider } from 'src/infrastructure/weather/providers/openweather.provider';
import { WeatherApiWeatherProvider } from 'src/infrastructure/weather/providers/weatherapi.provider';
import { WeatherController } from 'src/presentation/weather.controller';

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
