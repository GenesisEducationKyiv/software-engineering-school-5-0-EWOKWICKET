import { NestFactory } from '@nestjs/core';
import { SubscriptionDatabaseTestModule } from 'src/subscription/test/database.module.test';
import { DatabaseMigration } from '../database/infrastructure/database.migration';

async function runMigrations() {
  const app = await NestFactory.createApplicationContext(SubscriptionDatabaseTestModule);
  const migrationService = app.get<DatabaseMigration>(DatabaseMigration);
  await migrationService.migrateDatabase();
  await app.close();
}

runMigrations().catch((err) => {
  console.error('Migrations failed: ', err);
  process.exit(1);
});
