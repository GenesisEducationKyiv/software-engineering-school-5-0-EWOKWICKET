import { OpenWeatherWeatherFetch } from '../../../common/weather-provider/types/openweather-weather-fetch.type';
import { Weather } from '../../domain/weather.entity';

export class OpenWeatherDtoMapper {
  static toEntity(data: OpenWeatherWeatherFetch): Weather {
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0].description,
    };
  }
}
