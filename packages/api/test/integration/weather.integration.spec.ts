import { BadRequestException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrentWeatherAPI } from 'src/common/constants/types/current-weather-api.interface';
import { CurrentWeatherResponseDto } from 'src/weather/dtos/current-weather-response.dto';
import { WeatherController } from 'src/weather/weather.controller';
import { WeatherModule } from 'src/weather/weather.module';
import { mockFetch } from 'test/helpers/fetch.mock';

const fetchResponse: CurrentWeatherAPI = {
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
  let weatherController: WeatherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [WeatherModule],
    }).compile();

    weatherController = module.get<WeatherController>(WeatherController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getCurrentWeather', () => {
    it('should return weather if city found', async () => {
      mockFetch(fetchResponse, HttpStatus.OK);

      const result = await weatherController.getCurrentWeather(fetchResponse.location.name);
      expect(result).toMatchObject(weatherResponse);
    });

    it('should throw error if city not found', async () => {
      mockFetch({}, 403);

      const result = weatherController.getCurrentWeather('InvalidCity');
      await expect(result).rejects.toThrow(BadRequestException);
    });
  });
});
