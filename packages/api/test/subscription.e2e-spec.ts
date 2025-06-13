import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { DatabaseMigration } from '../src/database/database.migration';
import { DatabaseService } from '../src/database/database.service';
import { Subscription, SubscriptionSchema } from '../src/subscriptions/schemas/subscription.schema';

describe('SubscriptionController', () => {
  let app: INestApplication;
  let subscriptionModel: Model<Subscription>;

  beforeAll(async () => {
    const appModule: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forFeature([
          {
            name: Subscription.name,
            schema: SubscriptionSchema,
          },
        ]),
      ],
    }).compile();

    app = appModule.createNestApplication();
    subscriptionModel = app.get('SubscriptionModel');

    app.setGlobalPrefix('weatherapi.app/api');

    const dbService = app.get(DatabaseService);
    await dbService.waitForConnection();

    const dbMigration = app.get(DatabaseMigration);
    await dbMigration.migrateDatabase();

    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await subscriptionModel.findOneAndDelete({ email: 'user@example.com' }).exec();
      await app.close();
    }
  });

  describe('(POST) /subscribe', () => {
    it('should successfully subscribe', async () => {
      const dto = {
        email: 'user@example.com',
        city: 'London',
        frequency: 'daily',
      };

      const response = await request(app.getHttpServer())
        .post('/weatherapi.app/api/subscribe')
        .send(dto)
        .expect(200);

      expect(response.body).toEqual({});
    });

    it('should throw BadRequestException if dto is invalid', async () => {
      const invalidDto = {
        email: 'invalid email',
        city: 'London',
        frequency: 'invalid fruquency',
      };

      const response = await request(app.getHttpServer())
        .post('/weatherapi.app/api/subscribe')
        .send(invalidDto)
        .expect(400);

      expect(Array.isArray(response.body.message)).toBe(true);
      expect(response.body.message).toEqual(['email must be an email', 'frequency must be one of the following values: hourly, daily']);
    });

    it('should throw BadRequestException if location not found', async () => {
      const invalidCityDto = {
        email: 'user@example.com',
        city: 'NotCity',
        frequency: 'daily',
      };

      const response = await request(app.getHttpServer())
        .post('/weatherapi.app/api/subscribe')
        .send(invalidCityDto)
        .expect(400);

      expect(response.body.message).toBe('No matching location found');
      expect(response.body.possibleLocations).toEqual([]);
    });

    it('should throw ConflictException', async () => {
      const dto = {
        email: 'user@example.com',
        city: 'London',
        frequency: 'daily',
      };

      const response = await request(app.getHttpServer())
        .post('/weatherapi.app/api/subscribe')
        .send(dto)
        .expect(409);

      expect(response.body.message).toBe('Email already subscribed');
    });
  });

  describe('(GET) /confirm/:token', () => {
    it('should successfully confirm', async () => {
      const subscription = await subscriptionModel
        .findOne({ email: 'user@example.com' })
        .exec();
      expect(subscription).not.toBeNull();

      await request(app.getHttpServer())
        .get(`/weatherapi.app/api/confirm/${subscription!._id.toString()}`)
        .expect(200);

      const confirmed = await subscriptionModel
        .findOne({ _id: subscription!._id, confirmed: true })
        .exec();

      expect(confirmed).not.toBeNull();
    });

    it('should throw NotFoundException', async () => {
      return request(app.getHttpServer())
        .get('/weatherapi.app/api/confirm/invalid-token-456')
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toBe('Token Not Found');
        });
    });
  });

  describe('(GET) /unsubscribe/:token', () => {
    it('should throw NotFoundException', async () => {
      return request(app.getHttpServer())
        .get('/weatherapi.app/api/unsubscribe/invalid-token-456')
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toBe('Token Not Found');
        });
    });

    it('should successfully unsubscribe', async () => {
      const subscription = await subscriptionModel
        .findOne({ email: 'user@example.com' })
        .exec();
      expect(subscription).not.toBeNull();

      await request(app.getHttpServer())
        .get(`/weatherapi.app/api/unsubscribe/${subscription!._id.toString()}`)
        .expect(200);

      const unsubscribed = await subscriptionModel
        .findById(subscription!._id)
        .exec();
      expect(unsubscribed).toBeNull();
    });
  });
});
