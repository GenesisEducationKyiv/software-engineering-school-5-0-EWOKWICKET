import { Injectable } from '@nestjs/common';
import { CityFacadeInterface, WeatherFacadeInterface } from 'src/common/interfaces/weather-facade.interfaces';
import { CityProvider } from '../city/application/interfaces/city-provider.abstract';
import { WeatherProvider } from '../weather-api/application/interfaces/weather-provider.abstract';

@Injectable()
export class WeatherFacade implements WeatherFacadeInterface, CityFacadeInterface {
  constructor(
    private readonly weatherService: WeatherProvider,
    private readonly cityProvider: CityProvider,
  ) {}

  async getCurrentWeather(city: string) {
    return await this.weatherService.getCurrentWeather(city);
  }

  async cityExists(city: string) {
    return await this.cityProvider.cityExists(city);
  }
}
