import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import { Model, Types } from 'mongoose';
import { DatabaseExceptionFilter } from 'src/common/filters/database-exception.filter';
import { NotificationSubjects } from 'src/common/notifications/notification-subjects.enum';
import { NotificationType } from 'src/common/notifications/notification-type.enum';
import { appTestConfig } from 'src/config/test.config';
import { NotificationsServiceInterface } from 'src/notifications/application/interfaces/notifications-service.abstract';
import { NotificationsServiceTestModule } from 'src/notifications/notifications-service.module.test';
import { databaseTestConfig } from 'src/subscription/config/test.config';
import { SubscriptionDatabaseTestModule } from 'src/subscription/database/database.module.test';
import { Frequency } from 'src/subscription/subscriptions/domain/frequency.vo';
import { SubscriptionRepository } from 'src/subscription/subscriptions/infrastructure/persistence/repositories/subscription.repository';
import { SubscriptionDb } from 'src/subscription/subscriptions/infrastructure/persistence/schemas/subscription.schema';
import { CreateSubscriptionDto } from 'src/subscription/subscriptions/presentation/dtos/create-subscription.dto';
import { SubscriptionTestModule } from 'src/subscription/subscriptions/subscriptions.module.test';
import { CityTestModule } from 'src/weather/city/city.module.test';
import { OpenWeatherCityProvider } from 'src/weather/city/infrastructure/providers/openweather.provider';
import { WeatherApiCityProvider } from 'src/weather/city/infrastructure/providers/weatherapi.provider';
import { ExternalApiException } from 'src/weather/common/errors/external-api.error';
import * as request from 'supertest';
import { TestsUrl } from 'test/utils/test-urls.enum';

const succesfulSubscriptionDto: CreateSubscriptionDto = {
  email: 'oopsgu2006@gmail.com',
  city: 'CityValid',
  frequency: Frequency.HOURLY,
};

describe('SubscriptionController (Integration)', () => {
  let app: INestApplication;
  let subscriptionRepository: SubscriptionRepository; // to check repo calls
  let subscriptionModel: Model<SubscriptionDb>;
  let primaryProvider: WeatherApiCityProvider;
  let secondaryProvider: OpenWeatherCityProvider;

  const notificationsServiceMock: jest.Mocked<NotificationsServiceInterface> = {
    sendConfirmationNotification: jest.fn(),
    sendWeatherUpdateNotification: jest.fn(),
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
        SubscriptionDatabaseTestModule,
        CityTestModule,
        NotificationsServiceTestModule,
      ],
    })
      .overrideProvider(NotificationsServiceInterface)
      .useValue(notificationsServiceMock)
      .compile();

    app = module.createNestApplication();
    useContainer(app.select(SubscriptionTestModule), { fallbackOnErrors: true });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    app.useGlobalFilters(new DatabaseExceptionFilter());
    await app.init();

    subscriptionRepository = module.get<SubscriptionRepository>(SubscriptionRepository);
    subscriptionModel = module.get<Model<SubscriptionDb>>(getModelToken(SubscriptionDb.name));
    primaryProvider = module.get<WeatherApiCityProvider>(WeatherApiCityProvider);
    secondaryProvider = module.get<OpenWeatherCityProvider>(OpenWeatherCityProvider);
  });

  beforeEach(async () => {
    await subscriptionModel.deleteMany(); // clear all documents
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /subscribe', () => {
    it('should successfully subscribe if subsription is unique and city found', async () => {
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
      jest.spyOn(primaryProvider, 'validateCity').mockImplementationOnce(async () => {
        throw new ExternalApiException();
      });

      const secondaryProviderSpy = jest.spyOn(secondaryProvider, 'validateCity');

      await request(app.getHttpServer()).post(TestsUrl.SUBSCRIBE).send(succesfulSubscriptionDto);

      expect(secondaryProviderSpy).toHaveBeenCalledWith(succesfulSubscriptionDto.city);
      const newSubscription = await subscriptionModel.findOne({ email: succesfulSubscriptionDto.email, city: succesfulSubscriptionDto.city });
      expect(newSubscription).toBeDefined();
    });

    it('should return 400 when body is invalid', async () => {
      const invalidDto = {
        email: '@@@@',
        city: '',
        frequency: '',
      };

      const response = await request(app.getHttpServer()).post(TestsUrl.SUBSCRIBE).send(invalidDto).expect(400);

      expect(response.body.message).toEqual(expect.arrayContaining(['email must be an email', 'City Not Found', 'frequency must be one of the following values: hourly, daily']));
    });

    it('should throw 409 if subscription already exists', async () => {
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
