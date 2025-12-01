import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger('GlobalException');

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const user = (request as any).user;
        const userId = user?.userId || 'anonymous';

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : exception instanceof Error
                    ? exception.message
                    : 'Internal server error';

        const stack = exception instanceof Error ? exception.stack : undefined;

        // Log error with userId for debugging
        this.logger.error(
            JSON.stringify({
                timestamp: new Date().toISOString(),
                path: request.url,
                method: request.method,
                userId,
                status,
                message,
                stack: stack?.split('\n').slice(0, 3), // First 3 lines of stack
            }, null, 2)
        );

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: typeof message === 'string' ? message : (message as any).message || 'Error occurred',
        });
    }
}
