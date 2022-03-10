import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoggerFactory } from 'apps/util/util.logger.factory';
import { lastValueFrom, Observable, timeout } from 'rxjs';

@Injectable()
export class AppService {

  private readonly logger: Logger = LoggerFactory.createLogger(AppService.name);

  constructor(@Inject('WORKER') private worker: ClientProxy) { }

  startWorker() {
  }
}
