import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ExceptionFilter } from './exception.filter';
import { WorkerService } from './worker.service';

@Controller()
@UseFilters(ExceptionFilter)
export class WorkerController {

  constructor(private readonly workerService: WorkerService) { }


  @MessagePattern('start')
  getHello(): string {
    console.log(true)
    return this.workerService.getHello();
  }
}
