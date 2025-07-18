import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CityExistsRequest, CityExistsResponse, GetCurrentRequest, GetCurrentResponse } from '@proto/weather';
import { WeatherFacadeInterface } from 'src/facade/interfaces/weather-facade.interface';

@Controller()
export class WeatherController {
  constructor(private readonly facade: WeatherFacadeInterface) {}

  @GrpcMethod('WeatherService', 'getCurrentWeather')
  async getCurrentWeather({ city }: GetCurrentRequest): Promise<GetCurrentResponse> {
    return {
      weather: await this.facade.getCurrentWeather(city),
    };
  }

  @GrpcMethod('WeatherService', 'cityExists')
  async cityExists({ city }: CityExistsRequest): Promise<CityExistsResponse> {
    return {
      exists: await this.facade.cityExists(city),
    };
  }
}
