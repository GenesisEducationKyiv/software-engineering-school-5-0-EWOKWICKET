import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { subscriptionEnvSchema } from './config/env.validation';
import { SubscriptionDatabaseModule } from './database/database.module';
import { SubscriptionModule } from './subscriptions/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
      validationSchema: subscriptionEnvSchema,
    }),
    SubscriptionDatabaseModule,
    SubscriptionModule
  ],
})
export class SubscripionServiceModule {}
