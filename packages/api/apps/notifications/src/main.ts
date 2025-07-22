import { ServersConfigs } from '@common/configs/servers';
import { NestFactory } from '@nestjs/core';
import { AsyncMicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(AppModule, ServersConfigs.NOTIFICATIONS);

  await app.listen();
  console.log('Server Notifications is running');
}
bootstrap();
