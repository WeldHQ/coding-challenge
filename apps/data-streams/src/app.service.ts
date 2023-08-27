import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject('WORKER_SERVICE') private client: ClientProxy) {}

  // This is where we will store the data that we receive from the worker service
  private dataStore: any[] = [];

  getHello(): string {
    return 'Hello World!';
  }

  // Send a command to the worker service to start fetching data
  startFetching(): string {
    const interval = 1000 * 60 * 5; // 5 minutes
    this.client.emit('startFetching', { interval }); // 5 minutes
    return 'Started fetching data every 5 minutes.';
  }

  // Send a command to the worker service to stop fetching data
  stopFetching(): string {
    // Send a command to the worker service to stop fetching data
    this.client.emit('stopFetching', {});
    return 'Stopped fetching data.';
  }

  // Store the data that we receive from the worker service
  storeData(data: any) {
    this.dataStore = data.data;
  }

  // Return the data that we have stored
  getData(): any[] {
    return this.dataStore;
  }
}
