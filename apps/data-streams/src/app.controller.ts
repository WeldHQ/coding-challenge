import { Controller, Get, UseFilters } from '@nestjs/common';
import { AllExceptionsFilter } from './allExceptions.filter';
import { AppService } from './app.service';

@Controller("private")
@UseFilters(AllExceptionsFilter)
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("start")
  async startWorker(): Promise<string> {
    const response = await this.appService.startWorker({ "test": true })
    return JSON.stringify(response);
  }

}
