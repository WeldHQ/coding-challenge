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
    console.log('Received storeData event with data:', data.length);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('start-fetching')
  startFetchingData(): string {
    const interval = 1000 * 60 * 5; // 5 minutes
    this.client.emit('startFetching', { interval }); // 5 minutes
    return 'Started fetching data every 5 minutes.';
  }

  @Get('stop-fetching')
  stopFetchingData(): string {
    // Send a command to the worker service to stop fetching data
    this.client.emit('stopFetching', {});
    return 'Stopped fetching data.';
  }
}
