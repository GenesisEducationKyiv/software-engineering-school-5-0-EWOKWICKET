import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionFacadePublic, SubscriptionFacadeRepository } from 'src/common/interfaces/subscription-facade.interface';
import { databaseTestConfig } from '../config/test.config';
import { SubscriptionFacade } from '../public/subscription.facade';
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
