import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';

export abstract class WeatherHandler {
  protected next: WeatherHandler | null;

  abstract handle(city: string): Promise<CurrentWeatherResponseDto>;

  setNext(handler: WeatherHandler) {
    this.next = handler;
    return handler;
  }
}
