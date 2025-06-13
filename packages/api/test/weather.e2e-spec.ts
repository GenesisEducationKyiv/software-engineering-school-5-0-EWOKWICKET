import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { DatabaseMigration } from '../src/database/database.migration';
import { DatabaseService } from '../src/database/database.service';

describe('WeatherController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const appModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = appModule.createNestApplication();

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
      await app.close();
    }
  });

  describe('(GET) /weather', () => {
    it('should return current weather if location found', async () => {
      const expectedResponse = {
        temperature: expect.any(Number),
        humidity: expect.any(Number),
        description: expect.any(String),
      };

      const res = await request(app.getHttpServer())
        .get('/weatherapi.app/api/weather?city=London')
        .expect(200);

      expect(res.body).toMatchObject(expectedResponse);
    });

    it('should throw BadRequestException if location not found', async () => {
      const res = await request(app.getHttpServer())
        .get('/weatherapi.app/api/weather?city=NoCity')
        .expect(400);

      expect(res.body.message).toBe('No matching location found.');
    });
  });
});
