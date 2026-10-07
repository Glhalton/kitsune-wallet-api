import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';

type HttpError = { status: HttpStatus; message: string };

/**
 * Translates the Prisma errors the modules can raise into HTTP responses, so a
 * missing or conflicting record never surfaces as an unhandled 500.
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const { status, message } = this.toHttpError(exception);

    response.status(status).json({ statusCode: status, message });
  }

  private toHttpError(
    exception: Prisma.PrismaClientKnownRequestError,
  ): HttpError {
    switch (exception.code) {
      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Registro não encontrado',
        };
      case 'P2002':
        return {
          status: HttpStatus.CONFLICT,
          message: 'Registro já existente',
        };
      case 'P2003':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Referência inválida',
        };
      default:
        this.logger.error(
          `Unmapped Prisma error ${exception.code}`,
          exception.stack,
        );

        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Erro inesperado no banco de dados',
        };
    }
  }
}