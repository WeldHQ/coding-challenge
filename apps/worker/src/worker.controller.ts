import { Controller, Inject } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { EventPattern, ClientProxy } from '@nestjs/microservices';

@Controller()
export class WorkerController {
  constructor(
    private readonly workerService: WorkerService,
    @Inject('DATA_STREAMS_SERVICE') private client: ClientProxy,
  ) {}

  @EventPattern('startFetching')
  async handleStartFetchingEvent(data: any) {
    console.log('Received startFetching event with data:', data);
    this.client.emit('storeData', { data: 'some data' });
  }

  getHello(): string {
    return this.workerService.getHello();
  }
}
