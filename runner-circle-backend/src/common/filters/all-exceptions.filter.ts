import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Normaliza TODO erro para `{ "message": "..." }` — o front exibe essa
 * mensagem direto. Erros de validação (array) viram a
 * primeira mensagem legível.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno do servidor';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (res && typeof res === 'object') {
        const m = (res as Record<string, unknown>).message;
        if (Array.isArray(m)) message = String(m[0]);
        else if (typeof m === 'string') message = m;
        else message = exception.message;
      }
    } else if (exception instanceof Error) {
      // Log completo no servidor; mensagem genérica pro cliente.
      this.logger.error(exception.message, exception.stack);
    }

    response.status(status).json({ message });
  }
}
