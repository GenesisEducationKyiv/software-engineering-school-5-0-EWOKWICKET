import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { appTestConfig, databaseTestConfig } from 'src/config/test.config';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { ExternalApiException } from 'src/common/errors/external-api.error';
import { WeatherFetch } from 'src/weather/abstractions/weather-fetch.abstract';
import { CurrentWeatherResponseDto } from 'src/weather/dtos/current-weather-response.dto';
import { WeatherTestModule } from 'src/weather/test/weather.module.test';
import { CurrentOpenWeatherFetchDto, CurrentWeatherApiFetchDto } from 'src/weather/types/current-weather-api.type';
import * as request from 'supertest';
import { TestsUrl } from 'test/utils/test-urls.constant';

const fetchWeatherResponseOK: CurrentWeatherApiFetchDto = {
  location: { name: 'ValidCity', region: '', country: '' },
  current: { temp_c: 0, humidity: 1, condition: { text: 'text' } },
};

const fetchWeatherResponseError: CurrentWeatherApiFetchDto = {
  location: { name: 'Invalid', region: '', country: '' },
  current: { temp_c: 0, humidity: 1, condition: { text: 'text' } },
};

const weatherResponse: CurrentWeatherResponseDto = {
  temperature: 0,
  humidity: 1,
  description: 'text',
};

const reserveWeatherResponse: CurrentOpenWeatherFetchDto = {
  weather: [{ description: 'text' }],
  main: { temp: 0, humidity: 1 },
  name: 'ValidCity',
};

const weatherFetchMock: jest.Mocked<WeatherFetch> = {
  getCurrentWeatherRaw: jest.fn(),
};

describe('WeatherContoller (Integration)', () => {
  let app: INestApplication;

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
    })
      .overrideProvider(WeatherFetch)
      .useValue(weatherFetchMock)
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    app.setGlobalPrefix('weatherapi.app/api');
    app.init();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /weather?city', () => {
    it('should return weather if city found', async () => {
      weatherFetchMock.getCurrentWeatherRaw.mockResolvedValue(fetchWeatherResponseOK);

      const response = await request(app.getHttpServer()).get(`${TestsUrl.WEATHER}?city=${fetchWeatherResponseOK.location.name}`).expect(HttpStatus.OK);
      expect(response.body).toMatchObject(weatherResponse);
    });

    it('should return weather from reserve provider if first provider fails', async () => {
      weatherFetchMock.getCurrentWeatherRaw.mockRejectedValueOnce(new ExternalApiException()).mockResolvedValueOnce(reserveWeatherResponse);

      const response = await request(app.getHttpServer()).get(`${TestsUrl.WEATHER}?city=${reserveWeatherResponse.name}`).expect(HttpStatus.OK);

      expect(response.body).toMatchObject(weatherResponse);
    });

    it('should throw CityNotFoundException if city found is incorrect', async () => {
      weatherFetchMock.getCurrentWeatherRaw.mockResolvedValue(fetchWeatherResponseError);

      const response = await request(app.getHttpServer()).get(`${TestsUrl.WEATHER}?city=InvalidCity`).expect(HttpStatus.NOT_FOUND);
      expect(response.body).toHaveProperty('message', 'City not found');
    });

    it('should throw CityNotFoundException if city not found', async () => {
      weatherFetchMock.getCurrentWeatherRaw.mockRejectedValue(new CityNotFoundException());

      const response = await request(app.getHttpServer()).get(`${TestsUrl.WEATHER}?city=City`).expect(HttpStatus.NOT_FOUND);
      expect(response.body).toHaveProperty('message', 'City not found');
    });

    it('should throw ExternalApiException if external api returns 500', async () => {
      weatherFetchMock.getCurrentWeatherRaw.mockRejectedValue(new ExternalApiException());

      const response = await request(app.getHttpServer()).get(`${TestsUrl.WEATHER}?city=City`).expect(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.body).toHaveProperty('message', 'External API error occured');
    });
  });
});
