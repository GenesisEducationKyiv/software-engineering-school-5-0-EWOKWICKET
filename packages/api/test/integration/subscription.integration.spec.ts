import { BadRequestException, ConflictException, HttpStatus, NotFoundException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose, { Model, Types } from 'mongoose';
import { MailSubjects } from 'src/common/constants/enums/mail-subjects.enum';
import { NotificationType } from 'src/common/constants/enums/notification-type.enum';
import { NotificationsFrequencies } from 'src/common/constants/enums/notifications-frequencies.enum';
import { City } from 'src/common/constants/types/city.interface';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseService } from 'src/database/database.service';
import { Subscription, SubscriptionSchema } from 'src/database/schemas/subscription.schema';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { INotificationsService, NotificationsServiceToken } from 'src/scheduler/interfaces/notifications-service.interface';
import { CreateSubscriptionDto } from 'src/subscriptions/dtos/create-subscription.dto';
import { SubscriptionRepository } from 'src/subscriptions/services/subscription.repository';
import { SubscriptionController } from 'src/subscriptions/subscription.controller';
import { SubscriptionModule } from 'src/subscriptions/subscription.module';
import { WeatherModule } from 'src/weather/weather.module';
import { mockFetch } from 'test/mocks/fetch.mock';

const fetchCityResponse: City[] = [
  {
    name: 'CityValid',
    region: '',
    country: '',
  },
];

const invalidSubscriptionDto: CreateSubscriptionDto = {
  email: 'email',
  city: 'City',
  frequency: NotificationsFrequencies.HOURLY,
};

const succesfulSubscriptionDto = {
  ...invalidSubscriptionDto,
  city: fetchCityResponse[0].name,
};

describe('SubscriptionController (Integration)', () => {
  let module: TestingModule;
  let subscriptionController: SubscriptionController;
  let subscriptionRepository: SubscriptionRepository; // to check repo calls
  let subscriptionModel: Model<Subscription>;

  const notificationsServiceMock: INotificationsService = {
    sendConfirmationNotification: jest.fn(),
    sendWeatherUpdateNotification: jest.fn(),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        SubscriptionModule,
        WeatherModule,
        DatabaseModule,
        NotificationsModule,
        MongooseModule.forFeature([
          {
            name: Subscription.name,
            schema: SubscriptionSchema,
          },
        ]),
      ],
    })
      .overrideProvider(NotificationsServiceToken)
      .useValue(notificationsServiceMock)
      .compile();

    const dbService = module.get<DatabaseService>(DatabaseService);
    await dbService.startup();

    subscriptionController = module.get<SubscriptionController>(SubscriptionController);
    subscriptionRepository = module.get<SubscriptionRepository>(SubscriptionRepository);
    subscriptionModel = module.get<Model<Subscription>>(getModelToken(Subscription.name));
  });

  beforeEach(() => {
    mockFetch(fetchCityResponse, HttpStatus.OK); // mocks external api cities search
  });

  afterEach(async () => {
    await subscriptionModel.deleteMany(); // clear all documents
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await module.close();
  });

  describe('subscribe', () => {
    it('should successfully subscribe if subsription is unique and city found', async () => {
      const createRepoSpy = jest.spyOn(subscriptionRepository, 'create');

      await subscriptionController.subscribe(succesfulSubscriptionDto); // start flow

      expect(createRepoSpy).toHaveBeenCalledWith(succesfulSubscriptionDto); // create method of repo was called
      expect(notificationsServiceMock.sendConfirmationNotification).toHaveBeenCalledWith(
        // notificationsService was called woth some params passed
        expect.objectContaining({
          to: succesfulSubscriptionDto.email,
          subject: MailSubjects.SUBSCRIPTION_CONFIRMATION,
          token: expect.anything(),
        }),
        NotificationType.EMAIL,
      );
    });

    it('should throw BadRequestException if city not found', async () => {
      const createRepoSpy = jest.spyOn(subscriptionRepository, 'create');
      const result = subscriptionController.subscribe(invalidSubscriptionDto); // start flow

      await expect(result).rejects.toThrow(BadRequestException); // exception is thrown
      expect(createRepoSpy).not.toHaveBeenCalled(); // crate method of repo wasn't called
    });

    it('should throw ConflictException if subscription already exists', async () => {
      await subscriptionModel.create(succesfulSubscriptionDto);

      const createRepoSpy = jest.spyOn(subscriptionRepository, 'create');
      const result = subscriptionController.subscribe(succesfulSubscriptionDto); // start flow

      await expect(result).rejects.toThrow(ConflictException); // ConflictException is thrown
      expect(createRepoSpy).toHaveBeenCalledWith(succesfulSubscriptionDto); // repo method called with valid data
      expect(notificationsServiceMock.sendConfirmationNotification).not.toHaveBeenCalled(); // flow didn't reach notifications
    });
  });

  describe('confirm', () => {
    it('successfully confirm if subscription exists', async () => {
      const createdSubscription = await subscriptionModel.create({
        ...succesfulSubscriptionDto,
        confirmed: false,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });
      const subscriptionId = createdSubscription._id;

      const updateByIdSpy = jest.spyOn(subscriptionRepository, 'updateById');
      await subscriptionController.confirm(subscriptionId.toString()); // start flow
      const updatedSubscription = await subscriptionModel.findById(subscriptionId);

      // verifies new document's values
      expect(updatedSubscription.confirmed).toBe(true);
      expect(updatedSubscription.expiresAt).toBeNull();

      // verifies repo method's call params
      expect(updateByIdSpy).toHaveBeenCalledWith(subscriptionId, { confirmed: true, expiresAt: null });
    });

    it('should throw NotFoundException if subscription with token does not exist', async () => {
      // Generate a valid mongo id that doesn't exist in the database
      const nonExistentId = new Types.ObjectId();
      const updateByIdSpy = jest.spyOn(subscriptionRepository, 'updateById');

      const result = subscriptionController.confirm(nonExistentId.toString()); // start flow

      // NotFoundException is thrown
      await expect(result).rejects.toThrow(NotFoundException);
      await expect(result).rejects.toThrow('Token Not Found');

      // verifies repo method's call params
      expect(updateByIdSpy).toHaveBeenCalledWith(nonExistentId, { confirmed: true, expiresAt: null });
    });

    it('should throw NotFoundException if token is not a valid mongo id', async () => {
      const invalidToken = 'invalid-token';
      const updateByIdSpy = jest.spyOn(subscriptionRepository, 'updateById');

      const result = subscriptionController.confirm(invalidToken); // start flow

      // NotFoundException is thrown
      await expect(result).rejects.toThrow(NotFoundException);
      await expect(result).rejects.toThrow('Token Not Found');

      // flow didn't reach update method
      expect(updateByIdSpy).not.toHaveBeenCalled();
    });
  });

  describe('unsubscribe', () => {
    it('successfully unsubscribe if subscription exists', async () => {
      const createdSubscription = await subscriptionModel.create({
        ...succesfulSubscriptionDto,
        confirmed: true,
        expiresAt: null,
      });
      const subscriptionId = createdSubscription._id;

      const deleteByIdSpy = jest.spyOn(subscriptionRepository, 'deleteById');
      await subscriptionController.unsubscribe(subscriptionId.toString()); // start flow
      const deletedSubscription = await subscriptionModel.findById(subscriptionId);

      // verifies document doesn't exist
      expect(deletedSubscription).toBeNull();

      // verifies repo method's call params
      expect(deleteByIdSpy).toHaveBeenCalledWith(subscriptionId);
    });

    it('should throw NotFoundException if subscription with token does not exist', async () => {
      // Generate a valid mongo id that doesn't exist in the database
      const nonExistentId = new Types.ObjectId();
      const deleteByIdSpy = jest.spyOn(subscriptionRepository, 'deleteById');

      const result = subscriptionController.unsubscribe(nonExistentId.toString()); // start flow

      // NotFoundException is thrown
      await expect(result).rejects.toThrow(NotFoundException);
      await expect(result).rejects.toThrow('Token Not Found');

      // verifies repo method's call params
      expect(deleteByIdSpy).toHaveBeenCalledWith(nonExistentId);
    });

    it('should throw NotFoundException if token is not a valid mongo id', async () => {
      const invalidToken = 'invalid-token';
      const deleteByIdSpy = jest.spyOn(subscriptionRepository, 'deleteById');

      const result = subscriptionController.unsubscribe(invalidToken); // start flow

      // NotFoundException is thrown
      await expect(result).rejects.toThrow(NotFoundException);
      await expect(result).rejects.toThrow('Token Not Found');

      // flow didn't reach update method
      expect(deleteByIdSpy).not.toHaveBeenCalled();
    });
  });
});
