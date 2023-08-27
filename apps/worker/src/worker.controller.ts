import { Controller, Inject } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { EventPattern, ClientProxy } from '@nestjs/microservices';

@Controller()
export class WorkerController {
  constructor(
    private readonly workerService: WorkerService,
    @Inject('DATA_STREAMS_SERVICE') private readonly client: ClientProxy,
  ) {}

  private fetchInterval;

  @EventPattern('startFetching')
  async handleStartFetchingEvent(data: any) {
    const interval = data.interval || 300000; // Default to 5 minutes if not provided
    console.log(`Initialize fetching data every ${interval} milliseconds`);

    this.fetchInterval = setInterval(async () => {
      const response = await this.workerService.getCurrencies();

      if (response.status === 200) {
        this.client.emit('storeData', { data: response.data });
      }
    }, interval);
  }

  @EventPattern('stopFetching')
  async handleStopFetchingEvent() {
    console.log('Stop fetching data');

    if (this.fetchInterval) {
      clearInterval(this.fetchInterval);
      this.fetchInterval = null;
    }
  }

  getHello(): string {
    return this.workerService.getHello();
  }
}
