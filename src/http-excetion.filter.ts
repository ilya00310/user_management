/* eslint-disable prettier/prettier */
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const errorsResponse = exception.getResponse();
    let errors: string[] = [];
    if (typeof errorsResponse === 'object' && errorsResponse !== null) {
      if ('message' in errorsResponse) {
        errors = Array.isArray(errorsResponse.message) ? errorsResponse.message : [errorsResponse.message];
      }
    }
    response.status(status).json({
      success: false,
      error: errors,
    });
  }
}
