import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { ExternalApiException } from 'src/common/errors/external-api.error';
import { WeatherFetch } from '../abstractions/weather-fetch.abstract';
import { CurrentWeatherFetchDto } from '../types/current-weather-api.type';

@Injectable()
export class WeatherFetchService implements WeatherFetch {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('app.weatherApiKey');
    this.apiUrl = this.configService.get<string>('app.urls.outerWeatherApi');
  }

  async getCurrentWeatherRaw(url: string): Promise<CurrentWeatherFetchDto> {
    const response: Response = await fetch(url);
    if (response.status !== 200) {
      if (response.status === 400 || response.status === 404) throw new CityNotFoundException();
      else {
        throw new ExternalApiException();
      }
    }

    const data = await response.json();

    return data;
  }
}
