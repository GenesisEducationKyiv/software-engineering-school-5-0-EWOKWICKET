import { CityResponseDto } from './city-response.dto';

export class CurrentWeatherApiResponseDto {
  location: CityResponseDto;
  current: {
    temp_c: number;
    humidity: number;
    condition: {
      text: string;
    };
  };
}
