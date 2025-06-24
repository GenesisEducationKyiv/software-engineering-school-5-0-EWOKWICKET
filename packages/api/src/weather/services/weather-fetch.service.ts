import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { ExternalApiException } from 'src/common/errors/external-api.error';
import { CurrentWeatherApiResponseDto } from 'src/weather/constants/current-weather-api.interface';
import { WeatherFetch } from '../interfaces/weather-fetch.interface';

@Injectable()
export class WeatherFetchService implements WeatherFetch {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('app.weatherApiKey');
    this.apiUrl = this.configService.get<string>('app.urls.outerWeatherApi');
  }

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
