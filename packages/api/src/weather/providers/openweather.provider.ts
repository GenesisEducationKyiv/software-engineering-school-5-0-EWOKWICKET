import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Loggable } from 'src/common/interfaces/loggable.interace';
import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';
import { ChainableWeatherProvider } from '../interfaces/chainable-weather-provider.abstract';
import { CurrentOpenWeatherFetchDto } from '../types/current-weather-api.type';

@Injectable()
export class OpenWeatherWeatherProvider extends ChainableWeatherProvider implements Loggable {
  private readonly apiKey: string;
  private readonly apiUrl: string;
  readonly executor = 'OpenWeather';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    super();
    this.apiKey = this.configService.get('app.openWeatherApiKey');
    this.apiUrl = this.configService.get('app.urls.openWeatherApi');
  }

  async getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto> {
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

    return this.parseRawWeather(response.data);
  }

  parseRawWeather(data: CurrentOpenWeatherFetchDto): CurrentWeatherResponseDto {
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0].description,
    };
  }
}
