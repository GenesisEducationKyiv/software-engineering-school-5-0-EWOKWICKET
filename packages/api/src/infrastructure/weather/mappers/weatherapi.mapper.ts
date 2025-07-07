import { Weather } from 'src/domain/weather/weather.entity';
import { WeatherApiWeatherFetch } from 'src/infrastructure/shared/constants/weatherapi-weather-fetch.type';

export class WeatherApiDtoMapper {
  static toEntity(data: WeatherApiWeatherFetch): Weather {
    return {
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      description: data.current.condition.text,
    };
  }
}
