import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
    catch(exception: Error, host: ArgumentsHost): Observable<any> {
        return throwError(() => {
            return exception instanceof RpcException
                ? exception
                : new RpcException(exception.message)
        })
    }
}