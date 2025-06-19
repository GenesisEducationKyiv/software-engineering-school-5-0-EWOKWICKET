import { BadRequestException, Injectable } from '@nestjs/common';
import { Url } from 'src/common/constants/enums/url.constants';
import { CityResponseDto } from 'src/weather/constants/city-response.dto';
import { CurrentWeatherApiResponseDto } from 'src/weather/constants/current-weather-api.interface';
import { WeatherApiService as WeatherApiServiceInterface } from '../interfaces/weather-api-service.interface';

@Injectable()
export class WeatherApiService implements WeatherApiServiceInterface {
  private readonly apiUrl = Url.OUTER_WEATHER_API;
  private readonly apiKey = process.env.WEATHER_API_KEY;

  async searchCitiesRaw(city: string): Promise<CityResponseDto[]> {
    const searchUrl = `${this.apiUrl}/search.json?key=${this.apiKey}&q=${city}`;
    const response = await fetch(searchUrl);
    const data = await response.json();

    return data;
  }

  async getCurrentWeatherRaw(city: string): Promise<CurrentWeatherApiResponseDto> {
    const currentWeatherUrl = `${this.apiUrl}/current.json?key=${this.apiKey}&q=${city}`;

    const response: Response = await fetch(currentWeatherUrl);
    if (response.status !== 200) throw new BadRequestException('No matching location found.');

    const data = await response.json();
    if (data.location.name !== city) throw new BadRequestException('No matching location found.');

    return data;
  }
}
