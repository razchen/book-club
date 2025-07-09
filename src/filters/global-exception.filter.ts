import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { MulterError } from 'multer'; // Import MulterError

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'error.unknownError'; // Default message
    let errors: any = null;

    if (exception instanceof NotFoundException) {
      status = exception.getStatus();
      message = 'error.endpointNotFound'; // Translated message
    } else if (exception instanceof BadRequestException) {
      // Handle BadRequestException separately
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        // Preserve the validation errors from I18nValidationPipe
        message = exceptionResponse['message'] || 'Bad Request';
        errors = exceptionResponse['errors'] || null;
      } else {
        message = 'Bad Request';
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof MulterError) {
      // Handle Multer-specific errors
      status = HttpStatus.PAYLOAD_TOO_LARGE; // Or another appropriate status code
      message = 'error.fileUploadError'; // Translated message
    } else if (exception instanceof Error) {
      console.error(exception.stack); // Log the error stack for debugging
      message = 'error.internalError'; // Translated message
    } else {
      console.error('Unhandled exception:', exception);
      message = 'error.unexpectedError'; // Translated message
    }

    const response: any = {
      statusCode: status,
      message,
    };

    if (errors !== undefined && errors !== null) {
      response.errors = errors;
    }

    res.status(status).json(response);
  }
}
