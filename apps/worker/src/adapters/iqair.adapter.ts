import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { StreamDescriptionDto } from '../../../util/streamDescription.dto';
import { LoggerFactory } from '../../../util/util.logger.factory';
import { AxiosResponse } from 'axios';
import { catchError, lastValueFrom, timeout } from 'rxjs';
import { Adapter } from './adapter.abstract';
import { plainToClass } from 'class-transformer';

export class IQAirAdapter extends Adapter {
  protected readonly logger: Logger = LoggerFactory.createLogger(
    IQAirAdapter.name,
  );
  private readonly httpService: HttpService;
  private readonly config: IQAirConfig;

  constructor(
    streamDescription: StreamDescriptionDto,
    httpService: HttpService,
  ) {
    super(streamDescription);

    try {
      this.config = streamDescription.config;
    } catch (e) {
      this.logger.error(e);
      throw new Error(
        `Errors during construction of ${streamDescription.adapter} adapter.`,
      );
    }

    this.httpService = httpService;
  }

  async fetch(): Promise<IQAirPollutionDatapoint> {
    this.logger.debug('Fetching new data from IQAir.');

    const params = new IQAirNearestCityQuery(
      this.config.lat,
      this.config.lon,
      this.config.secretKey,
    );

    const url = `${this.config.origin}/v2/nearest_city`;
    this.logger.debug(
      `Sending IQAir reqest to: ${url} with params ${JSON.stringify(params)}`,
    );

    const observable = this.httpService
      .get(url, { params: params })
      .pipe(timeout(this.timeout))
      .pipe(catchError((e) => this.transformAxiosError(e)));

    const response = await lastValueFrom<AxiosResponse<any, any>>(observable);

    return plainToClass(
      IQAirPollutionDatapoint,
      response.data.data.current.pollution,
    );
  }
}

export type IQAirConfig = {
  origin: string;
  secretKey: string;
  lat: number;
  lon: number;
};

export class IQAirPollutionDatapoint {
  readonly ts: string;
  readonly aqius: number;
  readonly mainus: string;
  readonly aqicn: number;
  readonly maincn: string;
}

class IQAirNearestCityQuery {
  constructor(
    readonly lat: number,
    readonly lon: number,
    readonly key: string,
  ) {}
}
