import { WeatherResponseDto } from 'src/application/weather/dtos/weather-response.dto';

export type WeatherUpdate = {
  city: string;
} & WeatherResponseDto;
