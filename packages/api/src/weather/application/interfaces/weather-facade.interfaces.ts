export abstract class WeatherFacadePublic {
  abstract getCurrentWeather(city: string);
}

export abstract class CityFacadeInterface {
  abstract cityExists(city: string);
}
