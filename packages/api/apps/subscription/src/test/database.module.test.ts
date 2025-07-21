import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseTestConfig } from '../config/test.config';
import { DatabaseConfig } from '../database/config/database.config';
import { DatabaseMigration } from '../database/infrastructure/database.migration';
import { Subscription, SubscriptionSchema } from '../subscription/infrastructure/persistence/schemas/subscription.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [databaseTestConfig],
    }),
    MongooseModule.forRootAsync({
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
export class DatabaseTestModule {}
