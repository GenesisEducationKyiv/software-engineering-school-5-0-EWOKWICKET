import { BadRequestException, Injectable } from '@nestjs/common';
import { City } from 'src/common/constants/types/city.interface';
import { CurrentWeatherAPI } from 'src/common/constants/types/current-weather-api.interface';
import { IWeatherApiService } from '../interfaces/weather-api-service.interface';

@Injectable()
export class WeatherApiService implements IWeatherApiService {
  private readonly baseUrl = 'http://api.weatherapi.com/v1';
  private readonly apiKey = process.env.WEATHER_API_KEY;

  async searchCitiesRaw(city: string): Promise<City[]> {
    const searchUrl = `${this.baseUrl}/search.json?key=${this.apiKey}&q=${city}`;
    const response = await fetch(searchUrl);
    const data = await response.json();

    return data;
  }

  async getCurrentWeatherRaw(city: string): Promise<CurrentWeatherAPI> {
    const currentWeatherUrl = `${this.baseUrl}/current.json?key=${this.apiKey}&q=${city}`;

    const response: Response = await fetch(currentWeatherUrl);
    if (response.status !== 200) throw new BadRequestException('No matching location found.');

    const data = await response.json();
    if (data.location.name !== city) throw new BadRequestException('No matching location found.');

    return data;
  }
}
