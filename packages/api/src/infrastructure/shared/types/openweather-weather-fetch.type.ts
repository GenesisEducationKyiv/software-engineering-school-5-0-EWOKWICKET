export type OpenWeatherWeatherFetch = {
  weather: Array<{
    description: string;
  }>;
  main: {
    temp: number;
    humidity: number;
  };
  name: string;
};