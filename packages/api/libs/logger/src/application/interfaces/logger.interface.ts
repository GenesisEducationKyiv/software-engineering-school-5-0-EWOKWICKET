import { ErrorMetadata, InfoMetadata } from '../constants/log.types';

export abstract class LoggerInterface {
  abstract info(message: string, meta: InfoMetadata): void;
  abstract error(message: string, meta: ErrorMetadata): void;
  abstract warn(message: string, meta: ErrorMetadata): void;
  abstract debug(message: string, meta: InfoMetadata): void;
}
