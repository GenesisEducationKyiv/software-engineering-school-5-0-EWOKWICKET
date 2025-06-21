import { Injectable } from '@nestjs/common';
import { Handler } from '../../common/interfaces/handler.interface';
import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';
import { CurrentWeather } from '../interfaces/current-weather.interface';
import { OpenWeatherHandler } from './open-weather.handler';
import { WeatherApiHandler } from './weather-api.handler';

@Injectable()
export class WeatherService implements CurrentWeather {
  private readonly chain: Handler;

  constructor(
    private readonly weatherApiHandler: WeatherApiHandler,
    private readonly openWeatherHandler: OpenWeatherHandler,
  ) {
    this.chain = weatherApiHandler;
    this.weatherApiHandler.setNext(openWeatherHandler);
  }

  async getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto> {
    return this.chain.handle(city);
  }
}
