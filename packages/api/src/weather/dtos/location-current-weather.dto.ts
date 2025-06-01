import { CurrentWeatherResponseDto } from './current-weather-response.dto';

export class FullCurrentWeatherDto extends CurrentWeatherResponseDto {
  city: string;
}
