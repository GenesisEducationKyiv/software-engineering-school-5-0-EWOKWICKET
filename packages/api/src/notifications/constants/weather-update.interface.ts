import { CurrentWeatherResponseDto } from 'src/weather/dtos/current-weather-response.dto';

export type WeatherUpdateInterface = {
  city: string;
} & CurrentWeatherResponseDto;
