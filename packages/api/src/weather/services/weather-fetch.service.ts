import { Injectable } from '@nestjs/common';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { ExternalApiException } from 'src/common/errors/external-api.error';
import { WeatherFetch } from '../interfaces/weather-fetch.interface';
import { CurrentOpenWeatherFetchDto, CurrentWeatherApiFetchDto } from '../types/current-weather-api.type';

@Injectable()
export class WeatherFetchService implements WeatherFetch {
  async getCurrentWeatherRaw(url: string): Promise<CurrentWeatherApiFetchDto | CurrentOpenWeatherFetchDto> {
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
