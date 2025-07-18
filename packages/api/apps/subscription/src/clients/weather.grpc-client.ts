import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { CityExistsResponse, WeatherDto } from '@proto/weather';
import { lastValueFrom } from 'rxjs';
import { WeatherClient } from './interfaces/weather-client.interface';

@Injectable()
export class WeatherGrpcClient implements WeatherClient {
  private weather;

  constructor(@Inject('WEATHER') private readonly weatherClient: ClientGrpc) {}

  async cityExists(city: string): Promise<boolean> {
    const { exists }: CityExistsResponse = await lastValueFrom(this.weather.cityExists({ city }));
    return exists;
  }

  async getCurrentWeather(city: string): Promise<WeatherDto> {
    const { weather } = await this.weather.getCurrentWeather({ city });
    return weather;
  }

  onModuleInit() {
    this.weather = this.weatherClient.getService('WeatherService');
  }
}
