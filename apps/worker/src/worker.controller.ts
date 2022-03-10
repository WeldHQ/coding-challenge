import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ExceptionFilter } from './exception.filter';
import { WorkerService } from './worker.service';

@Controller()
@UseFilters(ExceptionFilter)
export class WorkerController {

  constructor(private readonly workerService: WorkerService) { }

  @MessagePattern('start')
  start(): object {
    this.workerService.startFetchCycle()
    return { success: true, message: "Started fetching from adapter IQAIR_DAILY." }
  }

  @MessagePattern('stop')
  stop(): object {
    this.workerService.stopFetchCycle()
    return { success: true, message: "Stopped fetching from adapter IQAIR_DAILY." }
  }
}
