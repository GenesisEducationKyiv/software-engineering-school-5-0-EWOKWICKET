import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GrpcToHttpExceptionFilter } from './common/filters/grpc-to-http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('weatherapi.app/api');
  app.enableCors();

  app.useGlobalFilters(new GrpcToHttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const host = configService.get('app.host');
  const port = configService.get<number>('app.port');

  await app.listen(port, () => {
    console.log(`Server is running on ${host}:${port}`);
  });
}
bootstrap();
