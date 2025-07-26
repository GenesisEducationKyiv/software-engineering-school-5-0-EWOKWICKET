import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from 'src/config/app.config';
import databaseConfig from 'src/config/database.config';
import { DatabaseModule } from 'src/database/database.module';
import { SubscriptionTestModule } from './subscriptions.module.test';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [appConfig, databaseConfig],
    }),
    DatabaseModule,
    SubscriptionTestModule,
  ],
})
export class AppTestModule {}
