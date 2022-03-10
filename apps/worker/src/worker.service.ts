import { Injectable, Logger } from '@nestjs/common';
import { WorkerConfigDto } from './worker.config.dto';

@Injectable()
export class WorkerService {

  private adapter: string;

  constructor(private readonly logger: Logger) { }

  startFetchCycle(data: WorkerConfigDto) {
    this.logger.log('Starting fetch cycle.')
    this.adapter = data.adapter;
  }

  stopFetchCycle() {
    this.logger.log('Stopping fetch cycle.')
  }

  getAdapterName() { return this.adapter }
}
