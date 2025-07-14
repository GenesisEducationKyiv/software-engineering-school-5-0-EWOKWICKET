import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionFacadePublic, SubscriptionFacadeRepository } from 'src/subscription/application/interfaces/subscription-facade.interface';
import { SubscriptionFacade } from './application/subscription.facade';
import databaseConfig from './config/database.config';
import { subscriptionEnvSchema } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { InternalSubscriptionController } from './presentation/internal.controller';
import { PublicSubscriptionController } from './presentation/public.controller';
import { SubscriptionDomainModule } from './subscription-domain/subscription-domain.module';

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
  controllers: [PublicSubscriptionController, InternalSubscriptionController],
  providers: [
    SubscriptionFacade,
    { provide: SubscriptionFacadeRepository, useExisting: SubscriptionFacade },
    { provide: SubscriptionFacadePublic, useExisting: SubscriptionFacade },
  ],
  exports: [SubscriptionFacadeRepository, SubscriptionFacadePublic],
})
export class SubscriptionModule {}
