import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Loggable } from 'src/common/interfaces/loggable.interace';
import { CurrentOpenWeatherFetchDto } from 'src/weather/types/current-weather-api.type';
import { ChainableCityValidation } from '../interfaces/chainable-city-validation.provider';

@Injectable()
export class OpenWeatherCityValidation extends ChainableCityValidation implements Loggable {
  private readonly apiKey: string;
  private readonly apiUrl: string;
  readonly executor = 'OpenWeather';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.apiKey = this.configService.get('app.openWeatherApiKey');
    this.apiUrl = this.configService.get('app.urls.openWeatherApi');
  }

  async validateCity(city: string): Promise<boolean> {
    const response = await firstValueFrom(
      this.httpService.request<CurrentOpenWeatherFetchDto>({
        method: 'GET',
        baseURL: this.apiUrl,
        url: '/weather',
        params: {
          appid: this.apiKey,
          q: city,
          units: 'metric',
        },
      }),
    );

    return this.isValid(response.data, city);
  }

  private isValid(data: CurrentOpenWeatherFetchDto, city: string): boolean {
    const valid = data.name === city;

    if (!valid) return false;
    return true;
  }
}
