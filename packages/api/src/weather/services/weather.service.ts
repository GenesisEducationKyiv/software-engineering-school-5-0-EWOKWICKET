import { Injectable } from '@nestjs/common';
import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';
import { OpenWeatherHandler } from '../handlers/open-weather.handler';
import { WeatherApiHandler } from '../handlers/weather-api.handler';
import { WeatherServiceInterface } from '../interfaces/current-weather.interface';
import { WeatherHandler } from '../interfaces/weather-handler.interface';

@Injectable()
export class WeatherService implements WeatherServiceInterface {
  private readonly chain: WeatherHandler;

  constructor(
    private readonly weatherApiHandler: WeatherApiHandler,
    private readonly openWeatherHandler: OpenWeatherHandler,
  ) {
    // this.chain = new WeatherLoggerDecorator(weatherApiHandler, 'WeatherApi');
    // this.weatherApiHandler.setNext(new WeatherLoggerDecorator(openWeatherHandler, 'OpenWeather'));
    this.chain = weatherApiHandler.setNext(openWeatherHandler);
  }

  async getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto> {
    return this.chain.handle(city);
  }
}
