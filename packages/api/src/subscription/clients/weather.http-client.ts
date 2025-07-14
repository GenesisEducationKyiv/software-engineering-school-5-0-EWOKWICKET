import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { WeatherClient } from './interfaces/weather-client.interface';

@Injectable()
export class WeatherHttpClient implements WeatherClient {
  private readonly weatherBaseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly http: HttpService,
  ) {
    this.weatherBaseUrl = this.configService.get('urls.weather');
  }

  async cityExists(city: string): Promise<boolean> {
    const { data } = await firstValueFrom(
      this.http.request({
        method: 'GET',
        baseURL: this.weatherBaseUrl,
        url: 'cityExists',
        params: { city },
      }),
    );
    return data;
  }
}
