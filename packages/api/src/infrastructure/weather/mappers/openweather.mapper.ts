import { WeatherResponseDto } from 'src/application/weather/dtos/weather-response.dto';
import { OpenWeatherWeatherFetch } from 'src/infrastructure/shared/types/openweather-weather-fetch.type';

export class OpenWeatherDtoMapper {
  static toEntity(data: OpenWeatherWeatherFetch): WeatherResponseDto {
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0].description,
    };
  }
}
