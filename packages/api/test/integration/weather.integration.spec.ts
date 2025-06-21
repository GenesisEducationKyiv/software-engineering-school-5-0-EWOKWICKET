import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { CurrentWeatherApiFetchDto } from 'src/weather/constants/current-weather-api.interface';
import { CurrentWeatherResponseDto } from 'src/weather/dtos/current-weather-response.dto';
import { WeatherModule } from 'src/weather/weather.module';
import * as request from 'supertest';
import { mockFetch } from 'test/utils/fetch.mock';
import { TestsUrl } from 'test/utils/test-urls.constant';

const fetchWeatherResponseOK: CurrentWeatherApiFetchDto | null = {
  location: {
    name: 'ValidCity',
    region: '',
    country: '',
  },
  current: {
    temp_c: 0,
    humidity: 1,
    condition: {
      text: 'text',
    },
  },
};

const fetchWeatherResponseError = fetchWeatherResponseOK;
fetchWeatherResponseError.location.name = 'Invalid';

const weatherResponse: CurrentWeatherResponseDto = {
  temperature: 0,
  humidity: 1,
  description: 'text',
};

describe('WeatherContoller (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
        }),
        WeatherModule,
      ],
    }).compile();

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
      mockFetch(fetchWeatherResponseOK, HttpStatus.OK);

      const response = await request(app.getHttpServer()).get(`${TestsUrl.WEATHER}?city=${fetchWeatherResponseOK.location.name}`).expect(HttpStatus.OK);
      expect(response.body).toMatchObject(weatherResponse);
    });

    it('should throw CityNotFoundException if city not found', async () => {
      mockFetch(fetchWeatherResponseError, HttpStatus.OK);

      const response = await request(app.getHttpServer()).get(`${TestsUrl.WEATHER}?city=InvalidCity`).expect(HttpStatus.NOT_FOUND);
      expect(response.body).toHaveProperty('message', 'City not found');
    });

    it('should throw CityNotFoundException if external api returns 400', async () => {
      mockFetch({}, HttpStatus.BAD_REQUEST);

      const response = await request(app.getHttpServer()).get(`${TestsUrl.WEATHER}?city=City`).expect(HttpStatus.NOT_FOUND);
      expect(response.body).toHaveProperty('message', 'City not found');
    });

    it('should throw ExternalApiException if external api returns 500', async () => {
      mockFetch({}, HttpStatus.INTERNAL_SERVER_ERROR);

      const response = await request(app.getHttpServer()).get(`${TestsUrl.WEATHER}?city=City`).expect(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.body).toHaveProperty('message', 'Exteranl API error occured');
    });
  });
});
