import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseTestConfig } from '../config/test.config';
import { SubscriptionFacadeInterface } from '../facade/interfaces/subscription-facade.interface';
import { SubscriptionFacade } from '../facade/subscription.facade';
import { SubscriptionController } from '../presentation/subcription.controller';
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
  controllers: [SubscriptionController],
  providers: [{ provide: SubscriptionFacadeInterface, useClass: SubscriptionFacade }],
  exports: [SubscriptionFacadeInterface],
})
export class SubscriptionTestModule {}
