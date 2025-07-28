import { ServersConfigs } from '@common/configs/servers';
import { NestFactory } from '@nestjs/core';
import { AsyncMicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(AppModule, ServersConfigs.WEATHER);

  await app.listen();
  console.log('Server Weather is running');
}
bootstrap();
