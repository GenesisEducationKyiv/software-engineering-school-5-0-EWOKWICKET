import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionFacadePublic, SubscriptionFacadeRepository } from 'src/common/interfaces/subscription-facade.interface';
import { databaseTestConfig } from '../config/test.config';
import { SubscriptionFacade } from '../public/subscription.facade';
import { SubscriptionDatabaseTestModule } from './database.module.test';
import { SubscriptionTestModule } from './subscriptions.module.test';

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
  providers: [
    SubscriptionFacade,
    { provide: SubscriptionFacadeRepository, useExisting: SubscriptionFacade },
    { provide: SubscriptionFacadePublic, useExisting: SubscriptionFacade },
  ],
  exports: [SubscriptionFacadeRepository, SubscriptionFacadePublic],
})
export class SubscriptionServiceTestModule {}
