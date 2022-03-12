import { Controller, Get, UseFilters } from '@nestjs/common';
import { Response } from 'apps/util/response.dto';
import { StreamDescriptionDto } from 'apps/util/streamDescription.dto';
import { IQAirConfigDto } from 'apps/worker/src/adapters/iqair.config.dto';
import { HttpExceptionsFilter } from '../../util/httpExceptions.filter';
import { AppService } from './app.service';

@Controller('private')
@UseFilters(HttpExceptionsFilter)
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('start')
  startWorker(): Promise<Response> {
    // const workerDefinition = new WorkerConfigDto("MOCK", 10000, 3000)

    const workerDefinition = new StreamDescriptionDto(
      'IQAIR_DAILY',
      300000, // 5 minutes
      30000,   // 30 seconds
      new IQAirConfigDto('http://api.airvisual.com/v2/nearest_city', 'mykey')
    )

    const response = this.appService.startWorker(workerDefinition)
    return response;
  }

  @Get('stop')
  stopWorker(): Promise<Response> {
    return this.appService.stopWorker();
  }

}
