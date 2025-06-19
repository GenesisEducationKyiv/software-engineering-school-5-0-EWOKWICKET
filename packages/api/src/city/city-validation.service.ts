import { Injectable } from '@nestjs/common';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { CityService } from './city.service';

@Injectable()
export class CityValidationService {
  constructor(private readonly cityService: CityService) {}

  async validateCity(city: string): Promise<void> {
    const data = await this.cityService.searchCities(city);
    const valid = data.length > 0 && data[0].name === city;

    if (!valid) {
      throw new CityNotFoundException();
    }
  }
}
