import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DatabaseMigration } from './database/database.migration';
import { DatabaseService } from './database/database.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('weatherapi.app/api');
  app.enableCors();

  const dbService: DatabaseService = app.get(DatabaseService);
  await dbService.waitForConnection();

  const dbMigration: DatabaseMigration = app.get(DatabaseMigration);
  await dbMigration.migrateDatabase();

  app.useGlobalFilters(new HttpExceptionFilter());

  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || 3001;

  await app.listen(port, () => {
    console.log(`Server is running on ${host}:${port}`);
  });
}
bootstrap();
