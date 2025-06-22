import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Url } from 'src/common/enums/url.constants';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { ExternalApiException } from 'src/common/errors/external-api.error';
import { CityFetch } from '../interfaces/city-fetch.interface';
import { CityHandler } from '../interfaces/city-handler.interface';
import { CityWeatherApiFetchDto } from '../types/city-response.type';

@Injectable()
export class WeatherApiHandler extends CityHandler {
  private readonly apiKey: string;

  constructor(
    @Inject(CityFetch)
    private readonly cityFetchService: CityFetch,
    private readonly configService: ConfigService,
  ) {
    super();
    this.apiKey = this.configService.get('WEATHERAPI_API_KEY');
  }

  async handle(city: string): Promise<void> {
    const apiUrl = `${Url.WEATHER_API}/search.json?key=${this.apiKey}&q=${city}`;
    try {
      const data = (await this.cityFetchService.searchCitiesRaw(apiUrl)) as unknown as CityWeatherApiFetchDto[];
      const valid = data.length > 0 && data[0].name === city;
      if (!valid) {
        throw new CityNotFoundException();
      }
      console.log('city weather api');
    } catch (err) {
      if (this.next && (err instanceof ExternalApiException || err instanceof CityNotFoundException)) {
        return this.next.handle(city);
      }
      throw err;
    }
  }
}
