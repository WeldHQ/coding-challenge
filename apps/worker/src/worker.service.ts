import { Injectable, Logger } from '@nestjs/common';
import { LoggerFactory } from 'apps/util/util.logger.factory';
import { Adapter } from './adapters/adapter.abstract';
import { AdapterFactory } from './adapters/adapter.factory';
import { WorkerConfigDto } from './worker.config.dto';
import { DataStreamsService } from './worker.data-streams.service';

@Injectable()
export class WorkerService {

  private intervalId?: NodeJS.Timeout

  private adapter?: Adapter

  private readonly logger: Logger = LoggerFactory.createLogger(WorkerService.name)

  constructor(
    private dataStreams: DataStreamsService,
    private adapterFactory: AdapterFactory
  ) { }

  async startFetchCycle(streamDescription: WorkerConfigDto) {
    if (this.intervalId) { this.stopFetchCycle() }
    this.adapter = this.adapterFactory.create(streamDescription)

    this.logger.log(`Starting fetch cycle for ${this.adapter.name} with an interval of ${streamDescription.interval}.`)
    this.fetchAndEmit(this.adapter)
    this.intervalId = setInterval(
      async () => { this.fetchAndEmit(this.adapter) },
      streamDescription.interval
    )
  }

  stopFetchCycle() {
    this.logger.log('Stopping fetch cycle.')
    clearInterval(this.intervalId)
  }

  getAdapterName(): string {
    return this.adapter.name
  }

  private async fetchAndEmit(adapter) {
    try {
      const results = await adapter.fetch(this.adapter.timeout)
      this.dataStreams.emitResults(results)
    } catch (error) {
      this.logger.error(error)
    }
  }

}
