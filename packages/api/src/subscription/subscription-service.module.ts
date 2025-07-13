import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionFacadePublic, SubscriptionFacadeRepository } from 'src/common/interfaces/subscription-facade.interface';
import databaseConfig from './config/database.config';
import { subscriptionEnvSchema } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { SubscriptionFacade } from './public/subscription.facade';
import { SubscriptionDomainModule } from './subscriptions/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      validationSchema: subscriptionEnvSchema,
    }),
    DatabaseModule,
    SubscriptionDomainModule,
  ],
  providers: [
    SubscriptionFacade,
    { provide: SubscriptionFacadeRepository, useExisting: SubscriptionFacade },
    { provide: SubscriptionFacadePublic, useExisting: SubscriptionFacade },
  ],
  exports: [SubscriptionFacadeRepository, SubscriptionFacadePublic],
})
export class SubscriptionModule {}
