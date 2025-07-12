import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseTestConfig } from '../config/test.config';
import { Subscription, SubscriptionSchema } from '../subscriptions/infrastructure/persistence/schemas/subscription.schema';
import { DatabaseConfig } from './config/database.config';
import { DatabaseMigration } from './infrastructure/database.migration';

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
        name: Subscription.name,
        schema: SubscriptionSchema,
      },
    ]),
  ],
  providers: [DatabaseMigration],
})
export class SubscriptionDatabaseTestModule {}
