export interface CityProvider {
  validateCity(city: string): Promise<boolean>;
}
