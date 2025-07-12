export abstract class WeatherFacadeInterface {
  abstract getCurrentWeather(city: string);
}

export abstract class CityFacadeInterface {
  abstract cityExists(city: string);
}
