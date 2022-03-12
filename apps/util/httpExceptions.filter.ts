import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Config } from './config.service';
import { LoggerFactory } from './util.logger.factory';

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {

    private readonly logger: Logger = LoggerFactory.createLogger(HttpExceptionsFilter.name)


    constructor(private readonly conf: Config, private readonly httpAdapterHost: HttpAdapterHost) { }

    catch(exception: any, host: ArgumentsHost): void {
        if (this.conf.NODE_ENV == 'development') {
            // Makes it easier to read during development.
            // Ideally I'd swap the logger implementation but this'll do.
            this.logger.error(exception.message)
            console.trace(exception)
        }

        // In certain situations `httpAdapter` might not be available in the
        // constructor method, thus we should resolve it here.
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();

        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.message
                : "Internal server error"

        const responseBody = {
            statusCode: httpStatus,
            message: message,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}
