import { LoggerInterface } from '@logger/application/interfaces/logger.interface';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { REDMetrics } from '../interfaces/metrics-service.interface';

@Injectable()
export class ObservabilityInterceptor implements NestInterceptor {
  constructor(
    private readonly transport: 'grpc' | 'http' | 'rmq',
    private readonly metrics: REDMetrics,
    private readonly logger: LoggerInterface,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const method = context.getHandler()?.name || 'unknown';

    const start = Date.now();
    this.metrics.onRequestStart(this.transport, method);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        this.metrics.onRequestEnd(this.transport, method, duration);
      }),
      catchError((err) => {
        this.metrics.onRequestError(this.transport, method);

        const error = err as any;
        //check if error is already logged
        if (!error.logged) {
          this.logger.error(err.message, {
            labels: {
              route: method,
            },
            error: {
              name: err.name,
              message: err.message,
            },
          });

          error.logged = true; //mark as logged
        }

        throw error;
      }),
    );
  }
}
