import { GrpcErrorDetails } from '@common/constants/grpc-error.type';
import { status } from '@grpc/grpc-js';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { Observable, throwError } from 'rxjs';

@Catch(MongoServerError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch(exception: MongoServerError, _host: ArgumentsHost): Observable<never> {
    if (exception.code === 11000) {
      const rpcException: GrpcErrorDetails = {
        code: status.ALREADY_EXISTS,
        details: 'Conflict Error',
      };

      return throwError(() => rpcException);
    }

    const rpcException: GrpcErrorDetails = {
      code: status.INTERNAL,
      details: 'Unexpected database error',
    };
    return throwError(() => rpcException);
  }
}
