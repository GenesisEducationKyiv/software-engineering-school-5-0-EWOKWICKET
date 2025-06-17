import { BadRequestException, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose, { Model } from 'mongoose';
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
import { mockFetch } from 'test/helpers/fetch.mock';

const fetchCityResponse: City[] = [
  {
    name: 'City',
    region: '',
    country: '',
  },
  {
    name: 'CityValid',
    region: '',
    country: '',
  },
];

const subscriptionDto: CreateSubscriptionDto = {
  email: 'email',
  city: '',
  frequency: NotificationsFrequencies.HOURLY,
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

  afterEach(async () => {
    await subscriptionModel.deleteMany(); // clear all documents
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await module.close();
  });

  describe('subscribe', () => {
    it('should successfilly subscribe if subsription is unique and city found', async () => {
      mockFetch(fetchCityResponse, HttpStatus.OK);
      const createRepoSpy = jest.spyOn(subscriptionRepository, 'create');
      const succesfulSubscriptionDto = {
        ...subscriptionDto,
        city: 'CityValid',
      };

      await subscriptionController.subscribe(succesfulSubscriptionDto);

      expect(createRepoSpy).toHaveBeenCalledWith(succesfulSubscriptionDto); // create method of repo was called
      expect(notificationsServiceMock.sendConfirmationNotification).toHaveBeenCalledWith(
        // notificationsService was called woth some params passed
        expect.objectContaining({
          to: subscriptionDto.email,
          subject: MailSubjects.SUBSCRIPTION_CONFIRMATION,
          token: expect.anything(),
        }),
        NotificationType.EMAIL,
      );
    });

    it('should throw exception if city not found', async () => {
      mockFetch(fetchCityResponse, HttpStatus.OK);

      const createRepoSpy = jest.spyOn(subscriptionRepository, 'create');
      const result = subscriptionController.subscribe({
        ...subscriptionDto,
        city: 'invalid', // doesn't match any of those in cityResponse
      });

      await expect(result).rejects.toThrow(BadRequestException); // exception is thrown
      expect(createRepoSpy).toHaveBeenCalledTimes(0); // crate method of repo wasn't called
    });
  });
});
