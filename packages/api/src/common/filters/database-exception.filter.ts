import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { mongo, MongooseError } from 'mongoose';

@Catch(MongooseError, mongo.MongoServerError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: MongooseError | mongo.MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof mongo.MongoServerError && exception.code === 11000) {
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: 'Conflict Error',
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Unexpected database error',
    });
  }
}
