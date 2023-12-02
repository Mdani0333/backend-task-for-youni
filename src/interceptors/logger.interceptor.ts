import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const userAgent = request.get('user-agent') || '';
    const { ip, method, path } = request;

    this.logger.log(
      `${method}--> ${path} {user-agent: "${userAgent}", IP: "${ip}"} execution: ${
        context.getClass().name
      } ${context.getHandler().name}`,
    );

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();

        const { statusCode } = response;

        this.logger.log(
          `${method}--> ${path}: ${statusCode} {user-agent: "${userAgent}", IP: "${ip}"} load-time:${
            Date.now() - now
          }ms`,
        );
      }),
    );
  }
}
