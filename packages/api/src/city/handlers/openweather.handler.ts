import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Url } from 'src/common/enums/url.constants';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { ExternalApiException } from 'src/common/errors/external-api.error';
import { CurrentOpenWeatherFetchDto } from 'src/weather/types/current-weather-api.type';
import { CityFetch } from '../interfaces/city-fetch.interface';
import { CityHandler } from '../interfaces/city-handler.interface';

@Injectable()
export class OpenWeatherHandler extends CityHandler {
  private readonly apiKey: string;

  constructor(
    @Inject(CityFetch)
    private readonly cityFetchService: CityFetch,
    private readonly configService: ConfigService,
  ) {
    super();
    this.apiKey = this.configService.get('OPENWEATHER_API_KEY');
  }

  async handle(city: string): Promise<void> {
    const apiUrl = `${Url.OPENWEATHER_API}/weather?q=${city}&appid=${this.apiKey}&units=metric`;
    try {
      const data = (await this.cityFetchService.searchCitiesRaw(apiUrl)) as unknown as CurrentOpenWeatherFetchDto;
      const valid = data.name === city;

      if (!valid) {
        throw new CityNotFoundException();
      }
      console.log('city openweather');
    } catch (err) {
      if (this.next && (err instanceof ExternalApiException || err instanceof CityNotFoundException)) {
        return this.next.handle(city);
      }
      throw err;
    }
  }
}
