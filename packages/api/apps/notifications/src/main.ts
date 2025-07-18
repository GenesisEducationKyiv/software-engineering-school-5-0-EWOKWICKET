import { AxiosExceptionFilter } from '@common/filters/axious-exception.filter';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
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
      package: 'notifications',
      protoPath: '../../libs/proto/src/notifications.proto',
    },
  });

  app.useGlobalFilters(new HttpExceptionFilter(), new AxiosExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen();
  console.log(`Server is running on ${url}`);
}
bootstrap();
