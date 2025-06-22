import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Url } from 'src/common/enums/url.constants';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { ProviderHandler } from 'src/common/interfaces/weather-handler.interface';
import { CityFetch } from '../interfaces/city-fetch.interface';
import { CityWeatherApiFetchDto } from '../types/city-response.type';

@Injectable()
export class CityWeatherApiHandler extends ProviderHandler<void> {
  private readonly apiKey: string;

  constructor(
    @Inject(CityFetch)
    private readonly cityFetchService: CityFetch,
    private readonly configService: ConfigService,
  ) {
    super();
    this.apiKey = this.configService.get('WEATHERAPI_API_KEY');
  }

  async fetch(city: string): Promise<void> {
    const apiUrl = `${Url.WEATHER_API}/search.json?key=${this.apiKey}&q=${city}`;

    const data = (await this.cityFetchService.searchCitiesRaw(apiUrl)) as unknown as CityWeatherApiFetchDto[];
    const valid = data.length > 0 && data[0].name === city;

    if (!valid) {
      throw new CityNotFoundException();
    }
  }

  get providerName(): string {
    return 'WeatherAPI';
  }
}
