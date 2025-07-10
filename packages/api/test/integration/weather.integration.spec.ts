import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { ExternalApiException } from 'src/common/errors/external-api.error';
import { appTestConfig, databaseTestConfig } from 'src/config/test.config';
import { WeatherTestModule } from 'src/test/weather.module.test';
import { Weather } from 'src/weather/domain/weather.entity';
import { OpenWeatherWeatherProvider } from 'src/weather/infrastructure/providers/openweather.provider';
import { WeatherApiWeatherProvider } from 'src/weather/infrastructure/providers/weatherapi.provider';
import * as request from 'supertest';
import { TestsUrl } from 'test/utils/test-urls.enum';

const weatherResponse: Weather = {
  temperature: 0,
  humidity: 1,
  description: 'text',
};

describe('WeatherContoller (Integration)', () => {
  let app: INestApplication;
  let primaryProvider: WeatherApiWeatherProvider;
  let secondaryProvider: OpenWeatherWeatherProvider;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          isGlobal: true,
          load: [appTestConfig, databaseTestConfig],
        }),
        WeatherTestModule,
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();

    primaryProvider = module.get<WeatherApiWeatherProvider>(WeatherApiWeatherProvider);
    secondaryProvider = module.get<OpenWeatherWeatherProvider>(OpenWeatherWeatherProvider);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /weather?city', () => {
    it('should return weather if city found', async () => {
      // first provider succeeds
      jest.spyOn(primaryProvider as any, 'getCurrentWeather').mockResolvedValue(weatherResponse);

      const response = await request(app.getHttpServer()).get(`${TestsUrl.WEATHER}?city=CityValid`).expect(HttpStatus.OK);
      expect(response.body).toMatchObject(weatherResponse);
    });

    it('should return weather from reserve provider if first provider fails', async () => {
      // first provider fails
      jest.spyOn(primaryProvider as any, 'getCurrentWeather').mockRejectedValue(new ExternalApiException());
      // second provider succeeds
      jest.spyOn(secondaryProvider as any, 'getCurrentWeather').mockResolvedValue(weatherResponse);

      const response = await request(app.getHttpServer()).get(`${TestsUrl.WEATHER}?city=CityValid`).expect(HttpStatus.OK);

      expect(response.body).toMatchObject(weatherResponse);
    });

    it('should throw CityNotFoundException if both providers fail', async () => {
      // both providers fail
      jest.spyOn(primaryProvider as any, 'getCurrentWeather').mockRejectedValue(new CityNotFoundException());
      jest.spyOn(secondaryProvider as any, 'getCurrentWeather').mockRejectedValue(new CityNotFoundException());

      const response = await request(app.getHttpServer()).get(`${TestsUrl.WEATHER}?city=InvalidCity`).expect(HttpStatus.NOT_FOUND);
      expect(response.body).toHaveProperty('message', 'City not found');
    });
  });
});
