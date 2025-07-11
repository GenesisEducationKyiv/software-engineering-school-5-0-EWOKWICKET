import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseTestConfig } from './config/test.config';
import { SubscriptionDatabaseTestModule } from './database/database.module.test';
import { SubscriptionTestModule } from './subscriptions/subscriptions.module.test';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [databaseTestConfig],
    }),
    SubscriptionDatabaseTestModule,
    SubscriptionTestModule,
  ],
})
export class SubscripionServiceModule {}
