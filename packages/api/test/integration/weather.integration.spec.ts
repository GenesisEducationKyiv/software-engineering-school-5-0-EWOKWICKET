import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { ExternalApiException } from 'src/common/errors/external-api.error';
import { CurrentWeatherResponseDto } from 'src/weather/dtos/current-weather-response.dto';
import { CurrentOpenWeatherFetchDto, CurrentWeatherApiFetchDto } from 'src/weather/types/current-weather-api.type';
import { WeatherModule } from 'src/weather/weather.module';
import * as request from 'supertest';
import { mockFetch } from 'test/utils/fetch.mock';
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

    it('should return weather from reserve provider if first provider fails', async () => {
      const reserveWeatherResponse: CurrentOpenWeatherFetchDto = {
        weather: [{ description: 'text' }],
        main: { temp: 0, humidity: 1 },
        name: 'ValidCity',
      };

      global.fetch = jest
        .fn()
        .mockRejectedValueOnce(new ExternalApiException())
        .mockResolvedValueOnce({
          status: 200,
          ok: true,
          json: async () => reserveWeatherResponse,
        } as Response);

      const response = await request(app.getHttpServer()).get(`${TestsUrl.WEATHER}?city=${reserveWeatherResponse.name}`).expect(HttpStatus.OK);

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
      expect(response.body).toHaveProperty('message', 'External API error occured');
    });
  });
});
