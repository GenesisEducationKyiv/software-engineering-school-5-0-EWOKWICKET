import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Loggable } from 'src/common/interfaces/loggable.interace';
import { ChainableCityValidation } from '../interfaces/chainable-city-validation.provider';
import { CityWeatherApiFetchDto } from '../types/city-fetch.type';

@Injectable()
export class WeatherApiCityValidation extends ChainableCityValidation implements Loggable {
  private readonly apiKey: string;
  private readonly apiUrl: string;
  readonly executor = 'WeatherAPI';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.apiKey = this.configService.get('app.weatherApiKey');
    this.apiUrl = this.configService.get('app.urls.weatherApi');
  }

  async validateCity(city: string): Promise<boolean> {
    const response = await firstValueFrom(
      this.httpService.request<CityWeatherApiFetchDto>({
        method: 'GET',
        baseURL: this.apiUrl,
        url: '/search.json',
        params: {
          key: this.apiKey,
          q: city,
        },
      }),
    );

    return this.isValid(response.data, city);
  }

  private isValid(data: CityWeatherApiFetchDto, city: string): boolean {
    const valid = data[0].name === city;

    if (!valid) return false;
    return true;
  }
}
