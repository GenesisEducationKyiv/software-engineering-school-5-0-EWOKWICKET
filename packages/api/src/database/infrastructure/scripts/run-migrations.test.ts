import { NestFactory } from '@nestjs/core';
import { DatabaseTestModule } from 'src/test/database.module.test';
import { DatabaseMigration } from '../database.migration';

async function runMigrations() {
  const app = await NestFactory.createApplicationContext(DatabaseTestModule);
  const migrationService = app.get<DatabaseMigration>(DatabaseMigration);
  await migrationService.migrateDatabase();
  await app.close();
}

runMigrations().catch((err) => {
  console.error('Migrations failed: ', err);
  process.exit(1);
});
