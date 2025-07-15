import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { ExternalApiException } from 'src/common/errors/external-api.error';
import { WeatherController } from 'src/presentation/weather.controller';
import { AppTestModule } from 'src/test/app.module.test';
import { Weather } from 'src/weather/domain/weather.entity';
import { OpenWeatherWeatherProvider } from 'src/weather/infrastructure/providers/openweather.provider';
import { WeatherApiWeatherProvider } from 'src/weather/infrastructure/providers/weatherapi.provider';

const weatherResponse: Weather = {
  temperature: 0,
  humidity: 1,
  description: 'text',
};

describe('WeatherContoller (Direct Method Call)', () => {
  let app: INestApplication;
  let weatherController: WeatherController;
  let primaryProvider: WeatherApiWeatherProvider;
  let secondaryProvider: OpenWeatherWeatherProvider;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppTestModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    weatherController = module.get<WeatherController>(WeatherController);
    primaryProvider = module.get<WeatherApiWeatherProvider>(WeatherApiWeatherProvider);
    secondaryProvider = module.get<OpenWeatherWeatherProvider>(OpenWeatherWeatherProvider);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return weather if city found', async () => {
    // first provider succeeds
    jest.spyOn(primaryProvider as any, 'getCurrentWeather').mockResolvedValue(weatherResponse);

    const response = await weatherController.getCurrentWeather('CityValid');
    expect(response).toMatchObject(weatherResponse);
  });

  it('should return weather from reserve provider if first provider fails', async () => {
    // first provider fails
    jest.spyOn(primaryProvider as any, 'getCurrentWeather').mockRejectedValue(new ExternalApiException());
    // second provider succeeds
    jest.spyOn(secondaryProvider as any, 'getCurrentWeather').mockResolvedValue(weatherResponse);

    const response = await weatherController.getCurrentWeather('CityValid');
    expect(response).toMatchObject(weatherResponse);
  });

  it('should throw CityNotFoundException if both providers fail', async () => {
    // both providers fail
    jest.spyOn(primaryProvider as any, 'getCurrentWeather').mockRejectedValue(new CityNotFoundException());
    jest.spyOn(secondaryProvider as any, 'getCurrentWeather').mockRejectedValue(new CityNotFoundException());

    await expect(weatherController.getCurrentWeather('InvalidCity')).rejects.toThrow(CityNotFoundException);
  });
});
