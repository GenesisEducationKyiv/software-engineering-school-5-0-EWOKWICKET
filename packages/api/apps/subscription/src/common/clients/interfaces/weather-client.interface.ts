export abstract class WeatherClient {
  abstract cityExists(city: string);
  abstract getCurrentWeather(city: string);
}
