import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, user } = request;
        const userId = user?.userId || 'anonymous';
        const startTime = Date.now();

        return next.handle().pipe(
            tap({
                next: () => {
                    const response = context.switchToHttp().getResponse();
                    const statusCode = response.statusCode;
                    const duration = Date.now() - startTime;

                    this.logger.log(
                        `${method} ${url} | User: ${userId} | Status: ${statusCode} | ${duration}ms`
                    );
                },
                error: (error) => {
                    const duration = Date.now() - startTime;
                    this.logger.error(
                        `${method} ${url} | User: ${userId} | Error: ${error.message} | ${duration}ms`
                    );
                },
            }),
        );
    }
}
