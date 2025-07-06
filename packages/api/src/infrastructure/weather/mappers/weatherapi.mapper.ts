import { WeatherResponseDto } from 'src/application/weather/dtos/weather-response.dto';
import { WeatherApiWeatherFetch } from 'src/infrastructure/shared/types/weatherapi-weather-fetch.type';

export class WeatherApiDtoMapper {
  static toEntity(data: WeatherApiWeatherFetch): WeatherResponseDto {
    return {
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      description: data.current.condition.text,
    };
  }
}
