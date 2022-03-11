import { Body, Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GrpcExceptionsFilter } from '../../util/grpcExceptions.filter';
import { WorkerConfigDto } from './worker.config.dto';
import { WorkerService } from './worker.service';

@Controller()
@UseFilters(GrpcExceptionsFilter)
export class WorkerController {

  constructor(private readonly workerService: WorkerService) { }

  @MessagePattern('start')
  start(@Body() data: WorkerConfigDto): object {
    this.workerService.startFetchCycle(data)
    return { success: true, message: `Started fetching from adapter ${this.workerService.getAdapterName()}.` }
  }

  @MessagePattern('stop')
  stop(): object {
    this.workerService.stopFetchCycle()
    return { success: true, message: `Stopped fetching from adapter ${this.workerService.getAdapterName()}.` }
  }
}
