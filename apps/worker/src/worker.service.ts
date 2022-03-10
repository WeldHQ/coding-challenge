import { Injectable, Logger } from '@nestjs/common';
import { LoggerFactory } from 'apps/util/util.logger.factory';
import { WorkerConfigDto } from './worker.config.dto';

@Injectable()
export class WorkerService {

  private adapter: string;

  private readonly logger: Logger = LoggerFactory.createLogger(WorkerService.name)

  startFetchCycle(data: WorkerConfigDto) {
    this.logger.log('Starting fetch cycle.')
    this.adapter = data.adapter;
  }

  stopFetchCycle() {
    this.logger.log('Stopping fetch cycle.')
  }

  getAdapterName() { return this.adapter }
}
