import { Injectable, Logger } from '@nestjs/common';
import { LoggerFactory } from 'apps/util/util.logger.factory';
import { lastValueFrom, Observable, timeout } from 'rxjs';
import { IQAirProvider } from './iqair.provider';
import { WorkerConfigDto } from './worker.config.dto';
import { DataStreamsService } from './worker.data-streams.service';

@Injectable()
export class WorkerService {

  private intervalId?: NodeJS.Timeout

  private adapterName?: string

  private readonly logger: Logger = LoggerFactory.createLogger(WorkerService.name)

  constructor(private dataStreams: DataStreamsService, private iqairAdapter: IQAirProvider) { }

  startFetchCycle(data: WorkerConfigDto) {
    if (this.intervalId) { this.stopFetchCycle() }

    this.logger.log(`Starting fetch cycle for ${data.adapter} with an interval of ${data.interval}.`)
    this.adapterName = data.adapter
    this.intervalId = setInterval(async () => {
      const results = await this.iqairAdapter.fetch(data.timeout)
      this.dataStreams.emitResults(results.data)
    }, data.interval)
  }

  stopFetchCycle() {
    this.logger.log('Stopping fetch cycle.')
    clearInterval(this.intervalId)
  }

  getAdapterName(): string {
    return this.adapterName
  }

}
