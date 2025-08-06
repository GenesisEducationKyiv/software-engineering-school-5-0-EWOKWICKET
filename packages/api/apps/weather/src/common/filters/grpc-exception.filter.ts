import { GrpcErrorDetails } from '@common/constants/grpc-error.type';
import { status } from '@grpc/grpc-js';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';

@Catch(Error)
export class GrpcExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch(exception: Error, _host: ArgumentsHost): Observable<never> {
    const grpcCode = this.mapErrorToGrpcCode(exception);
    const grpcError: GrpcErrorDetails = {
      code: grpcCode,
      details: exception.message,
    };

    return throwError(() => grpcError);
  }

  private mapErrorToGrpcCode(error: Error): status {
    switch (error.name) {
      case 'CityNotFoundError':
        return status.NOT_FOUND;

      case 'ExternalApiError':
      default:
        return status.INTERNAL;
    }
  }
}
