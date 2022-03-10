import { Controller, UseFilters } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { WorkerConfigDto } from 'apps/worker/src/worker.config.dto';
import { AllExceptionsFilter } from './allExceptions.filter';
import { AppService } from './app.service';

@Controller()
@UseFilters(AllExceptionsFilter)
export class TcpController {

  constructor(private readonly appService: AppService) { }

  @EventPattern('worker_available')
  async workerAvailable(): Promise<string> {
    const workerDefinition = new WorkerConfigDto(
      "IQAIR_DAILY",
      300000, // 5 minutes
      30000,   // 30 seconds
      // "endpoint": "http://api.airvisual.com/v2/nearest_city",
      // "secret_key": "mykey",
    )
    const response = await this.appService.startWorker(workerDefinition)
    return JSON.stringify(response);
  }

}
