import { Data } from '@logger/application/constants/data.type';
import { LoggerOptions } from '@logger/application/constants/logger.options';
import { LoggerInterface } from '@logger/application/interfaces/logger.interface';

export class SamplerProxy implements LoggerInterface {
  constructor(
    private readonly wrapped: LoggerInterface,
    private readonly options: LoggerOptions,
  ) {}

  private shouldLog(): boolean {
    return Math.random() < this.options.samplingRate;
  }

  info(message: string, data: Data) {
    if (this.shouldLog()) this.wrapped.info(message, data);
  }

  error(message: string, data: Data, trace?: string) {
    if (this.shouldLog()) this.wrapped.error(message, data, trace);
  }

  warn(message: string, data: Data) {
    if (this.shouldLog()) this.wrapped.warn(message, data);
  }

  debug(message: string, data: Data) {
    if (this.shouldLog()) this.wrapped.debug(message, data);
  }
}
