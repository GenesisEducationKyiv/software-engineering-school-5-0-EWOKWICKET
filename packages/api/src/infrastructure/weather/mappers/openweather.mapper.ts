import { Weather } from 'src/domain/weather/weather.entity';
import { OpenWeatherWeatherFetch } from 'src/infrastructure/shared/constants/openweather-weather-fetch.type';

export class OpenWeatherDtoMapper {
  static toEntity(data: OpenWeatherWeatherFetch): Weather {
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0].description,
    };
  }
}
