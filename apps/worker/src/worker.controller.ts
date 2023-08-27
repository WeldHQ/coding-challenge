import { Controller } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  private fetchInterval;

  @EventPattern('startFetching')
  async handleStartFetchingEvent(data: any) {
    this.workerService.startFetchingData(data.interval);
  }

  @EventPattern('stopFetching')
  async handleStopFetchingEvent() {
    this.workerService.stopFetchingData();
  }

  getHello(): string {
    return this.workerService.getHello();
  }
}
