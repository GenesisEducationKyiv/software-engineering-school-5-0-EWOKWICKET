import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { WeatherProvider } from '../weather/application/interfaces/weather-provider.abstract';
import { OpenWeatherWeatherProvider } from '../weather/infrastructure/providers/openweather.provider';
import { WeatherApiWeatherProvider } from '../weather/infrastructure/providers/weatherapi.provider';
import { WeatherProviderAdapter } from '../weather/infrastructure/wrappers/weather-povider.adapter';
import { WeatherController } from '../weather/presentation/weather.controller';
import { WeatherServiceTestModule } from './weather-service.module.test';

@Module({
  imports: [HttpModule.register({}), forwardRef(() => WeatherServiceTestModule)],
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
