import { Body, Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Response } from '../../util/response.dto';
import { GrpcExceptionsFilter } from '../../util/grpcExceptions.filter';
import { WorkerService } from './worker.service';
import { StreamDescriptionDto } from '../../util/streamDescription.dto';

@Controller()
@UseFilters(GrpcExceptionsFilter)
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @MessagePattern('start')
  start(@Body() streamDescription: StreamDescriptionDto): Response {
    this.workerService.startFetchCycle(streamDescription);
    return {
      success: true,
      message: `Started fetching from adapter ${this.workerService.getAdapterName()}.`,
    };
  }

  @MessagePattern('stop')
  stop(): Response {
    this.workerService.stopFetchCycle();
    return {
      success: true,
      message: `Stopped fetching from adapter ${this.workerService.getAdapterName()}.`,
    };
  }
}
