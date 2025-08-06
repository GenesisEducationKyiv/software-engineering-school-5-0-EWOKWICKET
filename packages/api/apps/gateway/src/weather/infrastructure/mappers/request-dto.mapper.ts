import { WeatherDto } from '@common/contracts/weather/dtos/weather.dto';
import { WeatherDto as ProtoWeatherDto } from '@proto/weather';

export class RequestDtoMapper {
  static toEntity(data: ProtoWeatherDto): WeatherDto {
    return {
      temperature: data.temperature,
      humidity: data.humidity,
      description: data.description,
    };
  }
}
