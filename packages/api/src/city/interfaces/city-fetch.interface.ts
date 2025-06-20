import { CityResponseDto } from 'src/weather/constants/city-response.dto';

export abstract class CityFetch {
  abstract searchCitiesRaw(city: string): Promise<CityResponseDto[]>;
}
