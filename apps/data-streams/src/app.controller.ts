import { Controller, Get, UseFilters } from '@nestjs/common';
import { WorkerConfigDto } from 'apps/worker/src/worker.config.dto';
import { AllExceptionsFilter } from './allExceptions.filter';
import { AppService } from './app.service';

@Controller("private")
@UseFilters(AllExceptionsFilter)
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("start")
  async startWorker(): Promise<string> {
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
