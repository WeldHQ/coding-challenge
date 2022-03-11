import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { LoggerFactory } from "apps/util/util.logger.factory";
import { AxiosResponse } from "axios";
import { lastValueFrom, Observable, timeout } from "rxjs";

@Injectable()
export class IQAirProvider {

  private readonly logger: Logger = LoggerFactory.createLogger(IQAirProvider.name)

  constructor(private httpService: HttpService) { }

  async fetch(timeoutMiliseconds: number): Promise<any> {
    this.logger.debug("Fetching new data from IQAir.")
    const observable = this.httpService
      .get('http://api.airvisual.com/v2/nearest_city')
      .pipe(timeout(timeoutMiliseconds));

    return await lastValueFrom<any>(observable)
  }

}