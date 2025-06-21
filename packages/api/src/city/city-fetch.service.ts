import { Injectable } from '@nestjs/common';
import { Url } from 'src/common/enums/url.constants';
import { ExternalApiException } from 'src/common/errors/external-api.error';
import { CityResponseDto } from 'src/weather/constants/city-response.dto';
import { CityFetch } from './interfaces/city-fetch.interface';

@Injectable()
export class CityFetchService implements CityFetch {
  private readonly apiUrl = Url.WEATHER_API;
  private readonly apiKey = process.env.WEATHER_API_KEY;

  async searchCitiesRaw(city: string): Promise<CityResponseDto[]> {
    const searchUrl = `${this.apiUrl}/search.json?key=${this.apiKey}&q=${city}`;
    const response = await fetch(searchUrl);

    if (response.status !== 200) throw new ExternalApiException();

    return await response.json();
  }
}
