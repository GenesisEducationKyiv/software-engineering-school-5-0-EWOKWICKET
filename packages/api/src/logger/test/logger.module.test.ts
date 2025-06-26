import { Module } from '@nestjs/common';
import { LoggerService } from '../logger.service';

const loggerServiceMock: Partial<LoggerService> = {
  logProviderAction: async () => {},
};

@Module({
  providers: [
    {
      provide: LoggerService,
      useValue: loggerServiceMock,
    },
  ],
  exports: [LoggerService],
})
export class LoggerTestModule {}
