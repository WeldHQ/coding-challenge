import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { WorkerService } from './worker.service';

@Controller()
export class WorkerController {

  constructor(private readonly workerService: WorkerService) { }


  @MessagePattern('start')
  getHello(): string {
    console.log(true)
    return this.workerService.getHello();
  }
}
