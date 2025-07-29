import { LoggerInterface } from '@logger/application/interfaces/logger.interface';
import { ConsumeMessage } from 'amqplib';

export function shouldRetry(err: unknown, message: ConsumeMessage, logger: LoggerInterface, route: string, maxRetries = 5): boolean {
  const error = err as Error & { name?: string; message?: string };
  const xDeath = message.properties.headers['x-death'] ?? [];
  const retryCount = xDeath[0]?.count ?? 0;

  if (retryCount >= maxRetries) {
    logger.error('Message dropped after max retries', {
      labels: { transport: 'rmq', route },
      error: {
        name: error.name,
        message: error.message,
      },
    });

    return false;
  }

  logger.warn(`Retrying message (attempt ${retryCount + 1} of ${maxRetries})`, {
    labels: { transport: 'rmq', route },
    error: {
      name: error.name,
      message: error.message,
    },
  });

  return true;
}
