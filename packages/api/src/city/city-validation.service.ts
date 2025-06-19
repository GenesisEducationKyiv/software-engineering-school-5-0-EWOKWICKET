import { Injectable } from '@nestjs/common';
import { CityNotFoundException } from 'src/common/errors/city-not-found.errors';
import { CityService } from './city.service';

@Injectable()
export class CityValidationService {
  constructor(private readonly cityService: CityService) {}

  async validateCity(city: string): Promise<void> {
    const data = await this.cityService.searchCities(city);

    const valid = data.length > 0 && data[0].name === city;

    if (!valid) {
      const possibleCities = data.map((city) => city.name);
      throw new CityNotFoundException(possibleCities);
    }
  }
}
