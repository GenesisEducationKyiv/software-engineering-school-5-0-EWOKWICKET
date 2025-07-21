import { GrpcServices } from '@common/configs/services';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CityExistsRequest, CityExistsResponse } from '@proto/weather';
import { CityProvider } from '../application/interfaces/city-provider.abstract';

@Controller()
export class CityController {
  constructor(private readonly cityService: CityProvider) {}

  @GrpcMethod(GrpcServices.WEATHER.name, GrpcServices.WEATHER.endpoints.cityExists)
  async cityExists({ city }: CityExistsRequest): Promise<CityExistsResponse> {
    return {
      exists: await this.cityService.cityExists(city),
    };
  }
}
