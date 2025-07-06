export abstract class CityProvider {
  abstract validateCity(city: string): Promise<boolean>;
}
