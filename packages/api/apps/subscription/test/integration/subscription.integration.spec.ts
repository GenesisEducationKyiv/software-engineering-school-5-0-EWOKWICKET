import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { SubscriptionController } from 'src/presentation/subcription.controller';
import { Frequency } from 'src/subscription/domain/frequency.vo';
import { SubscriptionRepository } from 'src/subscription/infrastructure/persistence/repositories/subscription.repository';
import { Subscription } from 'src/subscription/infrastructure/persistence/schemas/subscription.schema';
import { CreateSubscriptionDto } from 'src/subscription/presentation/dtos/create-subscription.dto';
import { AppTestModule } from 'src/test/app.module.test';

const succesfulSubscriptionDto: CreateSubscriptionDto = {
  email: 'oopsgu2006@gmail.com',
  city: 'CityValid',
  frequency: Frequency.HOURLY,
};

describe('SubscriptionController (Direct Method Call)', () => {
  let app: INestApplication;
  let subscriptionRepository: SubscriptionRepository; // to check repo calls
  let subscriptionModel: Model<Subscription>;
  let controller: SubscriptionController;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppTestModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    subscriptionRepository = module.get<SubscriptionRepository>(SubscriptionRepository);
    subscriptionModel = module.get<Model<Subscription>>(getModelToken(Subscription.name));
    controller = module.get<SubscriptionController>(SubscriptionController);
  });

  beforeEach(async () => {
    await subscriptionModel.deleteMany(); // clear all documents
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('subscribe', () => {
    it('should successfully subscribe if subsription is unique and city found', async () => {
      await controller.subscribe(succesfulSubscriptionDto);

      const newSubscription = await subscriptionModel.findOne({ email: succesfulSubscriptionDto.email, city: succesfulSubscriptionDto.city });
      expect(newSubscription).toBeDefined();
    });

    it('should throw if subscription already exists', async () => {
      await subscriptionModel.create(succesfulSubscriptionDto);
      await expect(controller.subscribe(succesfulSubscriptionDto)).rejects.toThrow();
    });
  });

  describe('confirm', () => {
    it('successfully confirm if subscription exists', async () => {
      const sub = await subscriptionModel.create(succesfulSubscriptionDto);
      await controller.confirm(sub._id.toString());

      // verifies document was updated
      const updated: Subscription = await subscriptionModel.findById(sub._id);
      expect(updated.confirmed).toBe(true);
      expect(updated.expiresAt).toBeNull();
    });

    it('should throw if token not found', async () => {
      // generate a valid mongo id that doesn't exist in the database
      const nonExistingId = new Types.ObjectId().toString();
      await expect(controller.confirm(nonExistingId)).rejects.toThrow('Token Not Found');
    });

    it('should throw 404 if token is not a valid mongo id', async () => {
      const invalidToken = 'invalid-token';
      const updateByIdSpy = jest.spyOn(subscriptionRepository, 'updateById');

      await expect(controller.confirm(invalidToken)).rejects.toThrow('Invalid Token');

      // flow didn't reach update method
      expect(updateByIdSpy).not.toHaveBeenCalled();
    });
  });

  describe('unsubscribe', () => {
    it('successfully unsubscribe if subscription exists', async () => {
      const sub = await subscriptionModel.create(succesfulSubscriptionDto);
      await controller.unsubscribe(sub._id.toString());

      // verifies document doesn't exist
      const deletedSubscription = await subscriptionModel.findById(sub._id);
      expect(deletedSubscription).toBeNull();
    });

    it('should throw if token not found', async () => {
      // generate a valid mongo id that doesn't exist in the database
      const nonExistingId = new Types.ObjectId().toString();
      await expect(controller.unsubscribe(nonExistingId)).rejects.toThrow('Token Not Found');
    });

    it('should throw if token is not a valid mongo id', async () => {
      const invalidToken = 'invalid-token';
      const deleteByIdSpy = jest.spyOn(subscriptionRepository, 'deleteById');

      await expect(controller.unsubscribe(invalidToken)).rejects.toThrow('Invalid Token');

      // flow didn't reach delete method
      expect(deleteByIdSpy).not.toHaveBeenCalled();
    });
  });
});
