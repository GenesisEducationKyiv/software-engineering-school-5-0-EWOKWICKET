import { ServersConfigs } from '@common/configs/servers';
import { LoggerInterface } from '@logger/application/interfaces/logger.interface';
import { NestFactory } from '@nestjs/core';
import { AsyncMicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(AppModule, ServersConfigs.WEATHER);

  const logger = app.get(LoggerInterface);

  await app.listen();
  console.log('Server Weather is running');
}
bootstrap();
