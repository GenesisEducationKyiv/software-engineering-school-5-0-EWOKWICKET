export interface ICitiesWeatherService {
  searchCities(city: string): Promise<string[]>;
}

export const CitiesWeatherServiceToken = 'ICitiesWeatherService';
