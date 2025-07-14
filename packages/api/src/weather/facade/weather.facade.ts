import { Injectable } from '@nestjs/common';
import { CityProvider } from '../city/application/interfaces/city-provider.abstract';
import { WeatherProvider } from '../weather-api/application/interfaces/weather-provider.abstract';
import { Weather } from '../weather-api/domain/weather.entity';
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
