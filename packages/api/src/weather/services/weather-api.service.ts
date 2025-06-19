import { Injectable } from '@nestjs/common';
import { Url } from 'src/common/enums/url.constants';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { ExternalApiException } from 'src/common/errors/external-api.error';
import { CurrentWeatherApiResponseDto } from 'src/weather/constants/current-weather-api.interface';
import { WeatherFetchService } from '../interfaces/weather-api-service.interface';

@Injectable()
export class WeatherApiService implements WeatherFetchService {
  private readonly apiUrl = Url.OUTER_WEATHER_API;
  private readonly apiKey = process.env.WEATHER_API_KEY;

  async getCurrentWeatherRaw(city: string): Promise<CurrentWeatherApiResponseDto> {
    const currentWeatherUrl = `${this.apiUrl}/current.json?key=${this.apiKey}&q=${city}`;

    const response: Response = await fetch(currentWeatherUrl);
    if (response.status !== 200) {
      if (response.status === 400) throw new CityNotFoundException();
      else throw new ExternalApiException();
    }

    const data = await response.json();
    if (data.location.name !== city) throw new CityNotFoundException();

    return data;
  }
}
