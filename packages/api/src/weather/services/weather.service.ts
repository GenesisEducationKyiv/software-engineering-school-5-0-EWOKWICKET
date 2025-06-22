import { Injectable } from '@nestjs/common';
import { ProviderLoggingDecorator } from 'src/common/decorators/weather-provider.decorator';
import { ProviderHandler } from '../../common/interfaces/weather-handler.interface';
import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';
import { CurrentOpenWeatherHandler } from '../handlers/weather-openweather.handler';
import { CurrentWeatherApiHandler } from '../handlers/weather-weatherapi.handler';
import { WeatherServiceInterface } from '../interfaces/current-weather.interface';

@Injectable()
export class WeatherService implements WeatherServiceInterface {
  private readonly chain: ProviderHandler<CurrentWeatherResponseDto>;

  constructor(
    private readonly weatherApiHandler: CurrentWeatherApiHandler,
    private readonly openWeatherHandler: CurrentOpenWeatherHandler,
  ) {
    const decoratedWeatherAPI = new ProviderLoggingDecorator(weatherApiHandler);
    const decoratedOpenWeather = new ProviderLoggingDecorator(openWeatherHandler);

    this.chain = decoratedWeatherAPI.setNext(decoratedOpenWeather);
  }

  async getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto> {
    return this.chain.handle(city);
  }
}
