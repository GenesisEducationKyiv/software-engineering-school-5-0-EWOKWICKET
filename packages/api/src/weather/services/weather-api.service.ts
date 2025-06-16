import { BadRequestException, Injectable } from '@nestjs/common';
import { Url } from 'src/common/constants/enums/url.constants';
import { City } from 'src/common/constants/types/city.interface';
import { CurrentWeatherAPI } from 'src/common/constants/types/current-weather-api.interface';
import { IWeatherApiService } from '../interfaces/weather-api-service.interface';

@Injectable()
export class WeatherApiService implements IWeatherApiService {
  private readonly apiUrl = Url.OUTER_WEATHER_API;
  private readonly apiKey = process.env.WEATHER_API_KEY;

  async searchCitiesRaw(city: string): Promise<City[]> {
    const searchUrl = `${this.apiUrl}/search.json?key=${this.apiKey}&q=${city}`;
    const response = await fetch(searchUrl);
    const data = await response.json();

    return data;
  }

  async getCurrentWeatherRaw(city: string): Promise<CurrentWeatherAPI> {
    const currentWeatherUrl = `${this.apiUrl}/current.json?key=${this.apiKey}&q=${city}`;

    const response: Response = await fetch(currentWeatherUrl);
    if (response.status !== 200) throw new BadRequestException('No matching location found.');

    const data = await response.json();
    if (data.location.name !== city) throw new BadRequestException('No matching location found.');

    return data;
  }
}
