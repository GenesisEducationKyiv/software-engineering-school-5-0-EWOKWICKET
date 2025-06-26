import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CityFetchDto } from 'src/city/types/city-response.type';
import { ExternalApiException } from 'src/common/errors/external-api.error';
import { CityFetch } from './abstractions/city-fetch.abstract';

@Injectable()
export class CityFetchService implements CityFetch {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('app.weatherApiKey');
    this.apiUrl = this.configService.get<string>('app.urls.outerWeatherApi');
  }

  async searchCitiesRaw(url: string): Promise<CityFetchDto> {
    const response = await fetch(url);
    if (response.status !== 200) throw new ExternalApiException();

    return await response.json();
  }
}
