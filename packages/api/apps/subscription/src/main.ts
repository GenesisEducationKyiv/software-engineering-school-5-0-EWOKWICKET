import { AxiosExceptionFilter } from '@common/filters/axious-exception.filter';
import { DatabaseExceptionFilter } from '@common/filters/database-exception.filter';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('subscription');
  app.enableCors();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalFilters(new HttpExceptionFilter(), new AxiosExceptionFilter(), new DatabaseExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const host = configService.get('app.host');
  const port = configService.get<number>('app.port');

  await app.listen(port, () => {
    console.log(`Server is running on ${host}:${port}`);
  });
}
bootstrap();
