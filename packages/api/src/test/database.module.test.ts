import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseTestConfig } from 'src/config/test.config';
import { DatabaseConfig } from 'src/database/config/database.config';
import { DatabaseMigration } from 'src/database/infrastructure/database.migration';
import { SubscriptionDb, SubscriptionSchema } from 'src/subscriptions/infrastructure/persistence/schemas/subscription.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      load: [databaseTestConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
      inject: [DatabaseConfig],
    }),
    MongooseModule.forFeature([
      {
        name: SubscriptionDb.name,
        schema: SubscriptionSchema,
      },
    ]),
  ],
  providers: [DatabaseMigration],
})
export class DatabaseTestModule {}
