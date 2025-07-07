import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from 'src/config/database.config';
import { SubscriptionDb, SubscriptionSchema } from '../subscription/schemas/subscription.schema';
import { DatabaseConfig } from './config/database.config';
import { DatabaseMigration } from './database.migration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
    }),
    MongooseModule.forRootAsync({
      useClass: DatabaseConfig,
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
export class DatabaseModule {}
