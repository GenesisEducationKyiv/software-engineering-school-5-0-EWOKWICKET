import { ErrorMetadata, InfoMetadata } from '@logger/application/constants/log.types';
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

  info(message: string, meta: InfoMetadata) {
    if (this.shouldLog()) this.wrapped.info(message, meta);
  }

  error(message: string, meta: ErrorMetadata) {
    if (this.shouldLog()) this.wrapped.error(message, meta);
  }

  warn(message: string, meta: ErrorMetadata) {
    if (this.shouldLog()) this.wrapped.warn(message, meta);
  }

  debug(message: string, meta: InfoMetadata) {
    if (this.shouldLog()) this.wrapped.debug(message, meta);
  }
}
