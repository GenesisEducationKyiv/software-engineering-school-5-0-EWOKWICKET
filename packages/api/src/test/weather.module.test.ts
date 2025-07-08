import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WeatherProvider } from 'src/application/weather/interfaces/weather-provider.abstract';
import { OpenWeatherWeatherProvider } from 'src/infrastructure/weather/providers/openweather.provider';
import { WeatherApiWeatherProvider } from 'src/infrastructure/weather/providers/weatherapi.provider';
import { WeatherProviderAdapter } from 'src/infrastructure/weather/wrappers/weather-povider.adapter';
import { WeatherController } from 'src/presentation/weather/weather.controller';

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
