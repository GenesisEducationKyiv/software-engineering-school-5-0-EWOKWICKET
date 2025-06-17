import { BadRequestException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrentWeatherAPI } from 'src/common/constants/types/current-weather-api.interface';
import { CurrentWeatherResponseDto } from 'src/weather/dtos/current-weather-response.dto';
import { WeatherController } from 'src/weather/weather.controller';
import { WeatherModule } from 'src/weather/weather.module';
import { mockFetch } from 'test/utils/fetch.mock';

const fetchWeatherResponse: CurrentWeatherAPI = {
  location: {
    name: 'City',
    region: '',
    country: '',
  },
  current: {
    temp_c: 0,
    humidity: 0,
    condition: {
      text: '',
    },
  },
};

const weatherResponse: CurrentWeatherResponseDto = {
  temperature: 0,
  humidity: 0,
  description: '',
};

describe('WeatherContoller (Integration)', () => {
  let module: TestingModule;
  let weatherController: WeatherController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [WeatherModule],
    }).compile();

    weatherController = module.get<WeatherController>(WeatherController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('getCurrentWeather', () => {
    it('should return weather if city found', async () => {
      mockFetch(fetchWeatherResponse, HttpStatus.OK);

      const result = await weatherController.getCurrentWeather(fetchWeatherResponse.location.name);
      expect(result).toMatchObject(weatherResponse); // matches structure of response
    });

    it('should throw exception if city not found', async () => {
      mockFetch({}, 403);

      const result = weatherController.getCurrentWeather('InvalidCity');
      await expect(result).rejects.toThrow(BadRequestException); // exception is thrown
    });
  });
});
