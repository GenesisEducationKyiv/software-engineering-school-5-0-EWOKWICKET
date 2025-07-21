import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CityExistsRequest, CityExistsResponse } from '@proto/weather';
import { CityProvider } from '../application/interfaces/city-provider.abstract';

@Controller()
export class CityController {
  constructor(private readonly cityService: CityProvider) {}

  @GrpcMethod('WeatherService', 'cityExists')
  async cityExists({ city }: CityExistsRequest): Promise<CityExistsResponse> {
    return {
      exists: await this.cityService.cityExists(city),
    };
  }
}
