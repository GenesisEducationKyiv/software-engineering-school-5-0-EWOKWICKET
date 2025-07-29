import { LoggerInterface } from '@logger/application/interfaces/logger.interface';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { REDMetrics } from '../interfaces/metrics-service.interface';

@Injectable()
export class GrpcObservabilityInterceptor implements NestInterceptor {
  private readonly transport = 'grpc';

  constructor(
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
        throw err;
      }),
    );
  }
}
