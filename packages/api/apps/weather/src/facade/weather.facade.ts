import { Injectable } from '@nestjs/common';
import { WeatherProvider } from 'src/weather/application/interfaces/weather-provider.abstract';
import { Weather } from 'src/weather/domain/weather.entity';
import { CityProvider } from '../city/application/interfaces/city-provider.abstract';
import { WeatherFacadeInterface } from './interfaces/weather-facade.interface';

@Injectable()
export class WeatherFacade implements WeatherFacadeInterface {
  constructor(
    private readonly weatherService: WeatherProvider,
    private readonly cityProvider: CityProvider,
  ) {}

  async getCurrentWeather(city: string): Promise<Weather> {
    return await this.weatherService.getCurrentWeather(city);
  }

  async cityExists(city: string): Promise<boolean> {
    return await this.cityProvider.cityExists(city);
  }
}
