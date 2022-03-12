import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { StreamDescriptionDto } from '../../../util/streamDescription.dto';
import { LoggerFactory } from '../../../util/util.logger.factory';
import { AxiosResponse } from 'axios';
import { catchError, lastValueFrom, timeout } from 'rxjs';
import { Adapter } from './adapter.abstract';

export class IQAirAdapter extends Adapter {
  protected readonly logger: Logger = LoggerFactory.createLogger(
    IQAirAdapter.name,
  );
  private readonly httpService: HttpService;
  private readonly endpoint: string;
  private readonly secretKey: string;

  constructor(
    streamDescription: StreamDescriptionDto,
    httpService: HttpService,
  ) {
    super(streamDescription);

    try {
      this.endpoint = streamDescription.config['endpoint'];
      this.secretKey = streamDescription.config['secretKey'];
    } catch (e) {
      this.logger.error(e);
      throw new Error(
        `Errors during construction of ${streamDescription.adapter} adapter.`,
      );
    }

    this.httpService = httpService;
  }

  async fetch(): Promise<Record<string, unknown>> {
    this.logger.debug('Fetching new data from IQAir.');

    const observable = this.httpService
      .get(this.endpoint)
      .pipe(timeout(this.timeout))
      .pipe(catchError((e) => this.transformAxiosError(e)));

    const response = await lastValueFrom<AxiosResponse<any, any>>(observable);

    return response.data;
  }
}
