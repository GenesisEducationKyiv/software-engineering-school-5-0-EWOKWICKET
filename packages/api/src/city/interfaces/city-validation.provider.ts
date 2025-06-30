export interface CityValidation {
  validateCity(city: string): Promise<boolean>;
}
