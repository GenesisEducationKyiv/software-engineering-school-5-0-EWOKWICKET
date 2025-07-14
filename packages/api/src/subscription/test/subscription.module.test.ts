import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionFacadePublic, SubscriptionFacadeRepository } from 'src/subscription/application/interfaces/subscription-facade.interface';
import { SubscriptionFacade } from '../application/subscription.facade';
import { databaseTestConfig } from '../config/test.config';
import { DatabaseTestModule } from './database.module.test';
import { SubscriptionDomainTestModule } from './subscriptions-domain.module.test';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [databaseTestConfig],
    }),
    DatabaseTestModule,
    SubscriptionDomainTestModule,
  ],
  providers: [
    SubscriptionFacade,
    { provide: SubscriptionFacadeRepository, useExisting: SubscriptionFacade },
    { provide: SubscriptionFacadePublic, useExisting: SubscriptionFacade },
  ],
  exports: [SubscriptionFacadeRepository, SubscriptionFacadePublic],
})
export class SubscriptionTestModule {}
