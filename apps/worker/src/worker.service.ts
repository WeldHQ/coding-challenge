import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class WorkerService {
  constructor(private readonly httpService: HttpService) {}

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
}
