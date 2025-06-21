import { CurrentWeatherResponseDto } from '../../weather/dtos/current-weather-response.dto';

export abstract class Handler {
  protected next: Handler | null;

  abstract handle(city: string): Promise<CurrentWeatherResponseDto>;

  setNext(handler: Handler) {
    this.next = handler;
    return handler;
  }
}
