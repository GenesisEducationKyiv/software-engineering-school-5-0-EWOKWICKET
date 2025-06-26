import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import { Model, Types } from 'mongoose';
import { CityFetch } from 'src/city/abstractions/city-fetch.abstract';
import { CityTestModule } from 'src/city/test/city.module.test';
import { CityWeatherApiFetchDto } from 'src/city/types/city-response.type';
import { ExternalApiException } from 'src/common/errors/external-api.error';
import { DatabaseExceptionFilter } from 'src/common/filters/database-exception.filter';
import { appTestConfig, databaseTestConfig } from 'src/config/test.config';
import { Subscription } from 'src/database/schemas/subscription.schema';
import { DatabaseTestModule } from 'src/database/test/database.module.test';
import { NotificationsServiceInterface } from 'src/notifications/abstractions/notifications-service.abstract';
import { NotificationsFrequencies } from 'src/notifications/constants/enums/notification-frequencies.enum';
import { NotificationSubjects } from 'src/notifications/constants/enums/notification-subjects.enum';
import { NotificationType } from 'src/notifications/constants/enums/notification-type.enum';
import { NotificationsTestModule } from 'src/notifications/test/notifications.module.test';
import { CreateSubscriptionDto } from 'src/subscriptions/dtos/create-subscription.dto';
import { SubscriptionRepository } from 'src/subscriptions/services/subscription.repository';
import { SubscriptionTestModule } from 'src/subscriptions/test/subscriptions.module.test';
import { CurrentOpenWeatherFetchDto } from 'src/weather/types/current-weather-api.type';
import * as request from 'supertest';
import { TestsUrl } from 'test/utils/test-urls.constant';

const validCityName = 'CityValid';
const cityWeatherApiFetchResponse: CityWeatherApiFetchDto[] = [{ name: validCityName, region: '', country: '' }];
const cityOpenweatherFetchResponse: CurrentOpenWeatherFetchDto = {
  weather: [{ description: '' }],
  main: { temp: 0, humidity: 0 },
  name: validCityName,
};

const succesfulSubscriptionDto: CreateSubscriptionDto = {
  email: 'oopsgu2006@gmail.com',
  city: validCityName,
  frequency: NotificationsFrequencies.HOURLY,
};

describe('SubscriptionController (Integration)', () => {
  let app: INestApplication;
  let subscriptionRepository: SubscriptionRepository; // to check repo calls
  let subscriptionModel: Model<Subscription>;

  const notificationsServiceMock: jest.Mocked<NotificationsServiceInterface> = {
    sendConfirmationNotification: jest.fn(),
    sendWeatherUpdateNotification: jest.fn(),
  };

  const cityFetchServiceMock: jest.Mocked<CityFetch> = {
    searchCitiesRaw: jest.fn(),
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          isGlobal: true,
          load: [appTestConfig, databaseTestConfig],
        }),
        SubscriptionTestModule,
        DatabaseTestModule,
        CityTestModule,
        NotificationsTestModule,
      ],
    })
      .overrideProvider(NotificationsServiceInterface)
      .useValue(notificationsServiceMock)
      .overrideProvider(CityFetch)
      .useValue(cityFetchServiceMock)
      .compile();

    app = module.createNestApplication();
    useContainer(app.select(SubscriptionTestModule), { fallbackOnErrors: true });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    app.useGlobalFilters(new DatabaseExceptionFilter());
    app.setGlobalPrefix('weatherapi.app/api');
    app.init();

    subscriptionRepository = module.get<SubscriptionRepository>(SubscriptionRepository);
    subscriptionModel = module.get<Model<Subscription>>(getModelToken(Subscription.name));
  });

  afterEach(async () => {
    await subscriptionModel.deleteMany(); // clear all documents
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /subscribe', () => {
    it('should successfully subscribe if subsription is unique and city found', async () => {
      cityFetchServiceMock.searchCitiesRaw.mockResolvedValue(cityWeatherApiFetchResponse);

      await request(app.getHttpServer()).post(TestsUrl.SUBSCRIBE).send(succesfulSubscriptionDto).expect(HttpStatus.OK);

      const newSubscription = await subscriptionModel.findOne({ email: succesfulSubscriptionDto.email, city: succesfulSubscriptionDto.city });
      expect(newSubscription).toBeDefined();

      expect(notificationsServiceMock.sendConfirmationNotification).toHaveBeenCalledWith(
        // notificationsService call args
        expect.objectContaining({
          to: succesfulSubscriptionDto.email,
          subject: `${NotificationSubjects.SUBSCRIPTION_CONFIRMATION} ${newSubscription.city}`,
          token: expect.anything(),
        }),
        NotificationType.EMAIL,
      );
    });

    it('should use reserve weather provider for city validation', async () => {
      cityFetchServiceMock.searchCitiesRaw.mockRejectedValueOnce(new ExternalApiException()).mockResolvedValueOnce(cityOpenweatherFetchResponse);

      await request(app.getHttpServer()).post(TestsUrl.SUBSCRIBE).send(succesfulSubscriptionDto).expect(HttpStatus.OK);

      const newSubscription = await subscriptionModel.findOne({ email: succesfulSubscriptionDto.email, city: succesfulSubscriptionDto.city });
      expect(newSubscription).toBeDefined();
    });

    it('should return 400 when body is invalid', async () => {
      cityFetchServiceMock.searchCitiesRaw.mockResolvedValue(cityWeatherApiFetchResponse);

      const invalidDto = {
        email: '@@@@',
        city: '',
        frequency: '',
      };

      const response = await request(app.getHttpServer()).post(TestsUrl.SUBSCRIBE).send(invalidDto).expect(400);

      expect(response.body.message).toEqual(expect.arrayContaining(['email must be an email', 'City Not Found', 'frequency must be one of the following values: hourly, daily']));
    });

    it('should throw ConflictException if subscription already exists', async () => {
      cityFetchServiceMock.searchCitiesRaw.mockResolvedValue(cityWeatherApiFetchResponse);
      const createRepoSpy = jest.spyOn(subscriptionRepository, 'create');

      await subscriptionModel.create(succesfulSubscriptionDto);
      await new Promise((resolve) => setTimeout(resolve, 50));

      await request(app.getHttpServer()).post(TestsUrl.SUBSCRIBE).send(succesfulSubscriptionDto).expect(HttpStatus.CONFLICT);

      expect(createRepoSpy).toHaveBeenCalledWith(succesfulSubscriptionDto); // repo method called with valid data
      expect(notificationsServiceMock.sendConfirmationNotification).not.toHaveBeenCalled(); // flow didn't reach notifications
    });
  });

  describe('GET /confirm/:token', () => {
    it('successfully confirm if subscription exists', async () => {
      const createdSubscription = await subscriptionModel.create(succesfulSubscriptionDto);
      await new Promise((resolve) => setTimeout(resolve, 50));
      const subscriptionId = createdSubscription._id.toString();

      await request(app.getHttpServer()).get(`${TestsUrl.CONFIRM}/${subscriptionId}`).expect(HttpStatus.OK);

      // verifies document was updated
      const updated = await subscriptionModel.findById(subscriptionId);
      expect(updated.confirmed).toBe(true);
      expect(updated.expiresAt).toBeNull();
    });

    it('should throw 404 if token not found', async () => {
      // generate a valid mongo id that doesn't exist in the database
      const nonExistingId = new Types.ObjectId().toString();

      const response = await request(app.getHttpServer()).get(`${TestsUrl.CONFIRM}/${nonExistingId}`).expect(404);
      expect(response.body).toHaveProperty('message', 'Token Not Found');
    });

    it('should throw 404 if token is not a valid mongo id', async () => {
      const invalidToken = 'invalid-token';
      const updateByIdSpy = jest.spyOn(subscriptionRepository, 'updateById');

      const response = await request(app.getHttpServer()).get(`${TestsUrl.CONFIRM}/${invalidToken}`).expect(404);

      expect(response.body).toHaveProperty('message', 'Invalid Token');
      // flow didn't reach update method
      expect(updateByIdSpy).not.toHaveBeenCalled();
    });
  });

  describe('GET unsubscribe/:token', () => {
    it('successfully unsubscribe if subscription exists', async () => {
      const createdSubscription = await subscriptionModel.create(succesfulSubscriptionDto);
      await new Promise((resolve) => setTimeout(resolve, 50));
      const subscriptionId = createdSubscription._id;

      await request(app.getHttpServer()).get(`${TestsUrl.UNSUBSCRIBE}/${subscriptionId}`).expect(HttpStatus.OK);

      // verifies document doesn't exist
      const deletedSubscription = await subscriptionModel.findById(subscriptionId);
      expect(deletedSubscription).toBeNull();
    });

    it('should throw 404 if token not found', async () => {
      // generate a valid mongo id that doesn't exist in the database
      const nonExistingId = new Types.ObjectId().toString();

      const response = await request(app.getHttpServer()).get(`${TestsUrl.UNSUBSCRIBE}/${nonExistingId}`).expect(404);
      expect(response.body).toHaveProperty('message', 'Token Not Found');
    });

    it('should throw 404 if token is not a valid mongo id', async () => {
      const invalidToken = 'invalid-token';
      const deleteByIdSpy = jest.spyOn(subscriptionRepository, 'deleteById');

      const response = await request(app.getHttpServer()).get(`${TestsUrl.UNSUBSCRIBE}/${invalidToken}`).expect(HttpStatus.NOT_FOUND);

      expect(response.body).toHaveProperty('message', 'Invalid Token');
      // flow didn't reach delete method
      expect(deleteByIdSpy).not.toHaveBeenCalled();
    });
  });
});
