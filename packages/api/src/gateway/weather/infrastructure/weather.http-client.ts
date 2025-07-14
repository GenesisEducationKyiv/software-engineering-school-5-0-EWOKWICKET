import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { WeatherClient } from '../application/interfaces/weather-client.interface';

@Injectable()
export class WeatherHttpClient implements WeatherClient {
  private readonly weatherBaseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly http: HttpService,
  ) {
    this.weatherBaseUrl = this.configService.get('urls.weather');
  }

  async getCurrentWeather(city: string) {
    const { data } = await firstValueFrom(
      this.http.request({
        method: 'GET',
        baseURL: this.weatherBaseUrl,
        url: 'current',
        params: { city },
      }),
    );

    return data;
  }
}
