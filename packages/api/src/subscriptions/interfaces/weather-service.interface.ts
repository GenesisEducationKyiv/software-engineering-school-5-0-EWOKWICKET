export interface CitiesWeatherService {
  searchCities(city: string): Promise<string[]>;
}

export const CitiesWeatherServiceToken = 'ICitiesWeatherService';
