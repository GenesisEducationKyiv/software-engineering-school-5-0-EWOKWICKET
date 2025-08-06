import { ServersConfigs } from '@common/configs/servers';
import { ObservabilityInterceptor } from '@common/metrics/interceptors/observability.interceptor';
import { REDMetrics } from '@common/metrics/interfaces/metrics-service.interface';
import { LoggerInterface } from '@logger/application/interfaces/logger.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AsyncMicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { setupRetryQueue } from './common/utils/setup-retry-queue';

async function bootstrap() {
  const httpApp = await NestFactory.create(AppModule);
  const configService = httpApp.get(ConfigService);
  await httpApp.listen(configService.get<number>('app.http.port'));

  const rmqApp = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(AppModule, ServersConfigs.NOTIFICATIONS);
  await setupRetryQueue(configService.get('app.rmq.url'), configService.get('app.rmq.queue'));

  const metricsService = rmqApp.get(REDMetrics);
  const logger = rmqApp.get(LoggerInterface);
  rmqApp.useGlobalInterceptors(new ObservabilityInterceptor('rmq', metricsService, logger));

  await rmqApp.listen();
  console.log('Notifications microservice is running');
}
bootstrap();
