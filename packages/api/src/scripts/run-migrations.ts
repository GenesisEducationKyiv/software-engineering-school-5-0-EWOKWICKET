import { NestFactory } from '@nestjs/core';
import { DatabaseMigration } from '../database/database.migration';
import { DatabaseModule } from '../database/database.module';

async function runMigrations() {
  const app = await NestFactory.createApplicationContext(DatabaseModule);
  const migrationService = app.get<DatabaseMigration>(DatabaseMigration);

  await migrationService.migrateDatabase();

  await app.close();
}

runMigrations().catch((err) => {
  console.error('Migrations failed: ', err);
  process.exit(1);
});
