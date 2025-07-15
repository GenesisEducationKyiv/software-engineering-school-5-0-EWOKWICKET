import { Module } from '@nestjs/common';
import { ProviderLogger } from './application/interfaces/logger.interface';
import { LoggerService } from './infrastructure/logger.service';

@Module({
  providers: [
    {
      provide: ProviderLogger,
      useClass: LoggerService,
    },
  ],
  exports: [ProviderLogger],
})
export class LoggerModule {}
