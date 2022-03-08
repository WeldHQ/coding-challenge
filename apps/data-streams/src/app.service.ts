import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoggerFactory } from './app.logger.factory';

@Injectable()
export class AppService {

  private readonly logger: Logger = LoggerFactory.createLogger(AppService.name);

  constructor(@Inject('WORKER') private worker: ClientProxy) { }

  startWorker() {
  }
}
