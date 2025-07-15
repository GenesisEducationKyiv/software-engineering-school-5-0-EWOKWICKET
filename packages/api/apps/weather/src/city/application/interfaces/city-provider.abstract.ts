export abstract class CityProvider {
  abstract cityExists(city: string): Promise<boolean>;
}
