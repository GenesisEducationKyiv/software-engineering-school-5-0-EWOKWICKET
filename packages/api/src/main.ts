import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { DatabaseExceptionFilter } from 'src/common/filters/database-exception.filter';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { AppModule } from './app.module';
import { AxiosExceptionFilter } from './common/filters/axious-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('weatherapi.app/api');
  app.enableCors();

  // for correct injection of constraints into validators
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalFilters(new HttpExceptionFilter(), new DatabaseExceptionFilter(), new AxiosExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const host = configService.get('app.host');
  const port = configService.get<number>('app.port');

  await app.listen(port, () => {
    console.log(`Server is running on ${host}:${port}`);
  });
}
bootstrap();
