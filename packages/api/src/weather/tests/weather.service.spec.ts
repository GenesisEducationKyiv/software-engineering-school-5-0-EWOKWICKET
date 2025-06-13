import { Test, TestingModule } from '@nestjs/testing';
import { WeatherApiService } from '../services/weather-api.service';
import { WeatherService } from '../services/weather.service';

describe('WeatherService', () => {
  let weatherService: WeatherService;
  let weatherApiService: jest.Mocked<WeatherApiService>;

  beforeAll(async () => {
    const weatherApiServiceMock = {
      searchCitiesRaw: jest.fn(),
      getCurrentWeatherRaw: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: WeatherApiService,
          useValue: weatherApiServiceMock,
        },
      ],
    }).compile();

    weatherService = module.get<WeatherService>(WeatherService);
    weatherApiService = module.get<WeatherApiService>(WeatherApiService) as jest.Mocked<WeatherApiService>;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('searchCities', () => {
    it('should return unique city names of the raw data', async () => {
      const mockRawCities = [{ name: 'London' }, { name: 'Londonderry' }, { name: 'Londoko' }];
      const mockResult = ['London', 'Londonderry', 'Londoko'];

      weatherApiService.searchCitiesRaw.mockResolvedValue(mockRawCities);
      const result = await weatherService.searchCities('Londo');

      expect(result).toEqual(mockResult);
      expect(weatherApiService.searchCitiesRaw).toHaveBeenCalledWith('Londo');
    });
  });

  describe('getCurrentWeather', () => {
    it('should return current weather for a city', async () => {
      const mockRawWeather = {
        current: {
          temp_c: 1,
          humidity: 2,
          condition: {
            text: 'Sunny',
          },
        },
      };
      const mockResult = {
        temperature: 1,
        humidity: 2,
        description: 'Sunny',
      };

      weatherApiService.getCurrentWeatherRaw.mockResolvedValue(mockRawWeather);
      const result = await weatherService.getCurrentWeather('London');

      expect(result).toEqual(mockResult);
      expect(weatherApiService.getCurrentWeatherRaw).toHaveBeenCalledWith('London');
    });
  });
});
