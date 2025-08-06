import { AxiosExceptionFilter } from '@common/filters/axious-exception.filter';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppTestModule } from './app.module.test';

async function bootstrap() {
  const app = await NestFactory.create(AppTestModule);
  app.setGlobalPrefix('weatherapi.app/api');
  app.enableCors();

  app.useGlobalFilters(new HttpExceptionFilter(), new AxiosExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const host = configService.get('app.host');
  const port = configService.get<number>('app.port');

  await app.listen(port, () => {
    console.log(`Server is running on ${host}:${port}`);
  });
}
bootstrap();
