import { AxiosExceptionFilter } from '@common/filters/axious-exception.filter';
import { DatabaseExceptionFilter } from '@common/filters/database-exception.filter';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { useContainer } from 'class-validator';
import * as path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const config = appContext.get(ConfigService);

  const host = config.get<string>('app.host');
  const port = config.get<string>('app.port');
  const url = `${host}:${port}`;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: url,
      package: 'subscription',
      protoPath: path.join(__dirname, '..', '..', '..', 'libs', 'proto', 'src', 'subscription.proto'),
    },
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalFilters(new HttpExceptionFilter(), new AxiosExceptionFilter(), new DatabaseExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen();
  console.log('Server Subscription is running');
}
bootstrap();
