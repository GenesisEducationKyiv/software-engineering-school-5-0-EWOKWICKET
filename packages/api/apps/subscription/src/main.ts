import { ServersConfigs } from '@common/configs/servers';
import { GrpcObservabilityInterceptor } from '@common/metrics/interceptors/grpc-observability.interceptor';
import { REDMetrics } from '@common/metrics/interfaces/metrics-service.interface';
import { LoggerInterface } from '@logger/application/interfaces/logger.interface';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AsyncMicroserviceOptions } from '@nestjs/microservices';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const httpApp = await NestFactory.create(AppModule);
  const configService = httpApp.get(ConfigService);
  await httpApp.listen(configService.get<number>('app.http.port'));

  const grpcApp = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(AppModule, ServersConfigs.SUBSCRIPTION);

  useContainer(grpcApp.select(AppModule), { fallbackOnErrors: true });
  grpcApp.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const metricsService = grpcApp.get(REDMetrics);
  const logger = grpcApp.get(LoggerInterface);
  grpcApp.useGlobalInterceptors(new GrpcObservabilityInterceptor(metricsService, logger));

  await grpcApp.listen();
  console.log('Subscription microservice is running');
}
bootstrap();
