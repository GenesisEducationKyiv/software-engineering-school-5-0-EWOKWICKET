import { Weather } from '../../domain/weather.entity';
import { WeatherApiWeatherFetch } from '../constants/weatherapi-weather-fetch.type';

export class WeatherApiDtoMapper {
  static toEntity(data: WeatherApiWeatherFetch): Weather {
    return {
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      description: data.current.condition.text,
    };
  }
}
