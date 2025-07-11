import { NestFactory } from '@nestjs/core';
import { SubscriptionDatabaseModule } from '../../database.module';
import { DatabaseMigration } from '../database.migration';

async function runMigrations() {
  const app = await NestFactory.createApplicationContext(SubscriptionDatabaseModule);
  const migrationService = app.get<DatabaseMigration>(DatabaseMigration);
  await migrationService.migrateDatabase();
  await app.close();
}

runMigrations().catch((err) => {
  console.error('Migrations failed: ', err);
  process.exit(1);
});
