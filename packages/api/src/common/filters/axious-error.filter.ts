import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Response } from 'express';

@Catch(AxiosError)
export class AxiosExceptionFilter implements ExceptionFilter {
  catch(exception: AxiosError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.response?.status ?? HttpStatus.BAD_GATEWAY;

    const exceptionResponse = exception.response?.data;

    if (!exceptionResponse || typeof exceptionResponse !== 'object') {
      response.status(status).json({
        statusCode: status,
        message: exception.message,
      });
    } else {
      response.status(status).json({
        statusCode: status,
        ...exceptionResponse,
      });
    }
  }
}
