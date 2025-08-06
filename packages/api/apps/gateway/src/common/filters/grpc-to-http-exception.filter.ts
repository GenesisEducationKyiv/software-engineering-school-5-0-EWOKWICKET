import { GrpcError } from '@common/errors/grpc.error';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';

@Catch(Error)
export class GrpcToHttpExceptionFilter implements ExceptionFilter {
  catch(exception: GrpcError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const details = exception.details || 'Unknown error';
    const grpcCode = exception.code ?? 2;
    const httpStatus = this.mapGrpcCodeToHttpStatus(grpcCode);

    response.status(httpStatus).json({
      statusCode: httpStatus,
      details,
    });
  }

  private mapGrpcCodeToHttpStatus(grpcCode: number): HttpStatus {
    switch (grpcCode) {
      case GrpcStatus.NOT_FOUND:
        return HttpStatus.NOT_FOUND;
      case GrpcStatus.INVALID_ARGUMENT:
        return HttpStatus.BAD_REQUEST;
      case GrpcStatus.ALREADY_EXISTS:
        return HttpStatus.CONFLICT;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
