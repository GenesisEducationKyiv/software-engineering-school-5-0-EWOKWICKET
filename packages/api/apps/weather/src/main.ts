import { ServersConfigs } from '@common/configs/servers';
import { GrpcExceptionFilter } from '@common/filters/grpc-exception.filter';
import { ObservabilityInterceptor } from '@common/metrics/interceptors/observability.interceptor';
import { REDMetrics } from '@common/metrics/interfaces/metrics-service.interface';
import { LoggerInterface } from '@logger/application/interfaces/logger.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AsyncMicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const httpApp = await NestFactory.create(AppModule);
  const configService = httpApp.get(ConfigService);
  await httpApp.listen(configService.get<number>('app.http.port'));

  const grpcApp = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(AppModule, ServersConfigs.WEATHER);

  const metricsService = grpcApp.get(REDMetrics);
  const logger = grpcApp.get(LoggerInterface);
  grpcApp.useGlobalInterceptors(new ObservabilityInterceptor('grpc', metricsService, logger));
  grpcApp.useGlobalFilters(new GrpcExceptionFilter());

  await grpcApp.listen();
  console.log('Weather microservice is running');
}
bootstrap();
