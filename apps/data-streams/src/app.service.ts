import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoggerFactory } from 'apps/util/util.logger.factory';
import { lastValueFrom, Observable, timeout } from 'rxjs';

@Injectable()
export class AppService {

  private readonly logger: Logger = LoggerFactory.createLogger(AppService.name);

  constructor(@Inject('WORKER') private worker: ClientProxy) { }

  async startWorker(streamDescription) {
    this.logger.debug(`Sending a start request to the worker: ${streamDescription.adapter}`)
    const success: Observable<boolean> = this.worker.send('start', streamDescription).pipe(timeout(5000));
    const result = await lastValueFrom(success)
    return result
  }

}



