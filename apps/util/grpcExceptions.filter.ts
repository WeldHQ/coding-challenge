import { Catch, RpcExceptionFilter, ArgumentsHost, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { Config } from './config.service';
import { LoggerFactory } from './util.logger.factory';

@Catch()
export class GrpcExceptionsFilter implements RpcExceptionFilter<RpcException> {

    private readonly logger: Logger = LoggerFactory.createLogger(GrpcExceptionsFilter.name)

    constructor(private readonly conf: Config, private readonly httpAdapterHost: HttpAdapterHost) { }

    catch(exception: Error, host: ArgumentsHost): Observable<any> {
        if (this.conf.NODE_ENV == 'development') {
            // Makes it easier to read during development.
            // Ideally I'd swap the logger implementation but this'll do.
            this.logger.error(exception.message)
            console.trace(exception)
        }

        return throwError(() => {
            return exception instanceof RpcException
                ? exception
                : new RpcException(exception.message)
        })
    }
}