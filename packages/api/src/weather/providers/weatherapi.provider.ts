import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Loggable } from 'src/common/interfaces/loggable.interace';
import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';
import { ChainableWeatherProvider } from '../interfaces/chainable-weather-provider.abstract';
import { CurrentWeatherApiFetchDto } from '../types/current-weather-api.type';

@Injectable()
export class WeatherApiWeatherProvider extends ChainableWeatherProvider implements Loggable {
  private readonly apiKey: string;
  private readonly apiUrl: string;
  readonly executor = 'WeatherAPI';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    super();
    this.apiKey = this.configService.get('app.weatherApiKey');
    this.apiUrl = this.configService.get('app.urls.weatherApi');
  }

  async getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto> {
    const response = await firstValueFrom(
      this.httpService.request<CurrentWeatherApiFetchDto>({
        method: 'GET',
        baseURL: this.apiUrl,
        url: '/current.json',
        params: {
          key: this.apiKey,
          q: city,
        },
      }),
    );

    return this.parseRawWeather(response.data);
  }

  private parseRawWeather(data: CurrentWeatherApiFetchDto): CurrentWeatherResponseDto {
    return {
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      description: data.current.condition.text,
    };
  }
}
