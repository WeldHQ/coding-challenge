import { HttpService } from "@nestjs/axios";
import { Logger } from "@nestjs/common";
import { LoggerFactory } from "apps/util/util.logger.factory";
import { AxiosResponse } from "axios";
import { catchError, lastValueFrom, timeout } from "rxjs";
import { WorkerConfigDto } from "../worker.config.dto";
import { Adapter } from "./adapter.abstract";

export class IQAirAdapter extends Adapter {

  protected readonly logger: Logger = LoggerFactory.createLogger(IQAirAdapter.name)
  private readonly httpService: HttpService

  constructor(streamDescription: WorkerConfigDto, httpService: HttpService) {
    super(streamDescription)
    this.httpService = httpService
  }

  async fetch(): Promise<object> {
    this.logger.debug("Fetching new data from IQAir.")

    const observable = this.httpService
      .get('http://api.airvisual.com/v2/nearest_city')
      .pipe(timeout(this.timeout))
      .pipe(catchError((e) => this.transformAxiosError(e)));

    const response = await lastValueFrom<AxiosResponse<any, any>>(observable)

    return response
  }
}

interface IQAirResponse {
  status: string
  data: IQAirResponseData
}

interface IQAirResponseData {
  message: string
}