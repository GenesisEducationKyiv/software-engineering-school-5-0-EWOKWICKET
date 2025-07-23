import { Services } from '@common/configs/services';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GetCurrentRequest, GetCurrentResponse } from '@proto/weather';
import { WeatherProvider } from '../application/interfaces/weather-provider.abstract';

@Controller()
export class WeatherController {
  constructor(private readonly weatherService: WeatherProvider) {}

  @GrpcMethod(Services.WEATHER.name, Services.WEATHER.endpoints.getCurrentWeather)
  async getCurrentWeather({ city }: GetCurrentRequest): Promise<GetCurrentResponse> {
    return {
      weather: await this.weatherService.getCurrentWeather(city),
    };
  }
}
