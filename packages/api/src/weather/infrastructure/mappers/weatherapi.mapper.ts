import { WeatherApiWeatherFetch } from 'src/weather/application/constants/weatherapi-weather-fetch.type';
import { Weather } from '../../domain/weather.entity';

export class WeatherApiDtoMapper {
  static toEntity(data: WeatherApiWeatherFetch): Weather {
    return {
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      description: data.current.condition.text,
    };
  }
}
