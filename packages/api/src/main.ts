import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('weatherapi.app/api');
  app.enableCors();

  // for correct injection of constraints into validators
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalFilters(new HttpExceptionFilter(), new DatabaseExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || 3001;

  await app.listen(port, () => {
    console.log(`Server is running on ${host}:${port}`);
  });
}
bootstrap();
