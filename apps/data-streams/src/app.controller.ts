import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('WORKER_SERVICE') private client: ClientProxy,
  ) {}

  @EventPattern('storeData')
  async handleStartFetchingEvent(data: any) {
    console.log('Received storeData event with data:', data);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('start-fetching')
  startFetchingData(): string {
    // Send a command to the worker service to start fetching data
    this.client.emit('startFetching', { interval: 300000 }); // 300000 ms = 5 minutes
    return 'Started fetching data every 5 minutes.';
  }
}
