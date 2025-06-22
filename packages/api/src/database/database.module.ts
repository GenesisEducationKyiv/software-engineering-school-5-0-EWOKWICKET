import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConfig } from './config/database.config';
import { DatabaseMigration } from './database.migration';
import { Subscription, SubscriptionSchema } from './schemas/subscription.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
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
export class DatabaseModule {}
