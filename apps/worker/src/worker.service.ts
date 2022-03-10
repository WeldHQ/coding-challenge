import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WorkerService {

  constructor(private readonly logger: Logger) { }

  startFetchCycle() {
    this.logger.log('Starting fetch cycle.')
  }

  stopFetchCycle() {
    this.logger.log('Stopping fetch cycle.')
  }
}
