import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class WorkerService {
  constructor(
    private readonly httpService: HttpService,
    @Inject('DATA_STREAMS_SERVICE') private readonly client: ClientProxy,
  ) {}

  private fetchInterval;

  getHello(): string {
    return 'Hello World!';
  }

  async getCurrencies(): Promise<AxiosResponse<any>> {
    const response = await lastValueFrom(
      this.httpService.get(
        'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json',
      ),
    );

    return response;
  }

  async startFetchingData(interval: number): Promise<string> {
    if (!this.fetchInterval) {
      console.log('Initial fetching data');
      const response = await this.getCurrencies();

      if (response.status === 200) {
        this.client.emit('storeData', { data: response.data });
      }
    }

    const intervalToUse = interval || 300000;
    console.log(`Initialize fetching data every ${intervalToUse} milliseconds`);

    this.fetchInterval = setInterval(async () => {
      const response = await this.getCurrencies();

      if (response.status === 200) {
        this.client.emit('storeData', { data: response.data });
      }
    }, intervalToUse);

    return `Started fetching data every ${intervalToUse} milliseconds.`;
  }

  stopFetchingData(): string {
    console.log('Stop fetching data');

    if (this.fetchInterval) {
      clearInterval(this.fetchInterval);
      this.fetchInterval = null;
    }

    return 'Stopped fetching data.';
  }
}
