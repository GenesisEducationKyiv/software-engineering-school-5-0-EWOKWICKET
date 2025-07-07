import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseTestConfig } from 'src/config/test.config';
import { SubscriptionDb, SubscriptionSchema } from '../../subscription/schemas/subscription.schema';
import { DatabaseConfig } from '../config/database.config';
import { DatabaseMigration } from '../database.migration';

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
