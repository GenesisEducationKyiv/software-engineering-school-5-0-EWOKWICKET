import { NestFactory } from '@nestjs/core';
import { DatabaseMigration } from 'src/database/database.migration';
import { DatabaseTestModule } from 'src/database/test/database.module.test';

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
