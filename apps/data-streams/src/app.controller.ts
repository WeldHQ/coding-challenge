import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('storeData')
  storeData(data: object) {
    this.appService.storeData(data);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('start-fetching')
  startFetching(): string {
    return this.appService.startFetching();
  }

  @Get('stop-fetching')
  stopFetching(): string {
    return this.appService.stopFetching();
  }

  @Get('data')
  getData(): any[] {
    return this.appService.getData();
  }
}
