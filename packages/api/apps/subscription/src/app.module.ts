import { LoggerModule } from '@logger/logger.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import clientsConfig from './config/clients.config';
import databaseConfig from './config/database.config';
import { subscriptionEnvSchema } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { MetricsModule } from './metrics/metrics.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, clientsConfig],
      validationSchema: subscriptionEnvSchema,
    }),
    LoggerModule.forRoot({ service: 'Subscription', samplingRate: 0.8 }),
    MetricsModule,
    DatabaseModule,
    SubscriptionModule,
    SchedulerModule,
  ],
})
export class AppModule {}
