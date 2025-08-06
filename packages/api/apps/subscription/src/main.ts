import { ServersConfigs } from '@common/configs/servers';
import { ObservabilityInterceptor } from '@common/metrics/interceptors/observability.interceptor';
import { REDMetrics } from '@common/metrics/interfaces/metrics-service.interface';
import { LoggerInterface } from '@logger/application/interfaces/logger.interface';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AsyncMicroserviceOptions } from '@nestjs/microservices';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter';
import { GrpcExceptionFilter } from './common/filters/grpc-exception.filter';

async function bootstrap() {
  const httpApp = await NestFactory.create(AppModule);
  const configService = httpApp.get(ConfigService);
  await httpApp.listen(configService.get<number>('app.http.port'));

  const grpcApp = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(AppModule, ServersConfigs.SUBSCRIPTION);

  useContainer(grpcApp.select(AppModule), { fallbackOnErrors: true });
  grpcApp.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  grpcApp.useGlobalFilters(new DatabaseExceptionFilter(), new GrpcExceptionFilter());

  const metricsService = grpcApp.get(REDMetrics);
  const logger = grpcApp.get(LoggerInterface);
  grpcApp.useGlobalInterceptors(new ObservabilityInterceptor('grpc', metricsService, logger));

  await grpcApp.listen();
  console.log('Subscription microservice is running');
}
bootstrap();
