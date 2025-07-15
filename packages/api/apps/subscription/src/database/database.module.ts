import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from 'src/config/database.config';
import { Subscription, SubscriptionSchema } from 'src/subscription-domain/infrastructure/persistence/schemas/subscription.schema';
import { DatabaseConfig } from './config/database.config';
import { DatabaseMigration } from './infrastructure/database.migration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/subscription/.env',
      load: [databaseConfig],
    }),
    MongooseModule.forRootAsync({
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
