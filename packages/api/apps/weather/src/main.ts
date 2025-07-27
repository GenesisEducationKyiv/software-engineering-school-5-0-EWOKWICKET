import { ServersConfigs } from '@common/configs/servers';
import { AxiosExceptionFilter } from '@common/filters/axious-exception.filter';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AsyncMicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(AppModule, ServersConfigs.WEATHER);

  app.useGlobalFilters(new HttpExceptionFilter(), new AxiosExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen();
  console.log('Server Weather is running');
}
bootstrap();
