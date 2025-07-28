import { ServersConfigs } from '@common/configs/servers';
import { LoggerInterface } from '@logger/application/interfaces/logger.interface';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AsyncMicroserviceOptions } from '@nestjs/microservices';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(AppModule, ServersConfigs.SUBSCRIPTION);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const logger = app.get(LoggerInterface);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen();
  console.log('Server Subscription is running');
}
bootstrap();
