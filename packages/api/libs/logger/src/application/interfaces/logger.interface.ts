import { Metadata } from '../constants/log.types';

export abstract class LoggerInterface {
  abstract info(message: string, meta: Metadata);
  abstract error(message: string, meta: Metadata);
  abstract warn(message: string, meta: Metadata);
  abstract debug(message: string, meta: Metadata);
}
