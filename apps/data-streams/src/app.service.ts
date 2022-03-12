import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from '../../util/response.dto';
import { StreamDescriptionDto } from '../../util/streamDescription.dto';
import { LoggerFactory } from '../../util/util.logger.factory';
import { lastValueFrom, Observable, timeout } from 'rxjs';

@Injectable()
export class AppService {
  private streamDescription: StreamDescriptionDto;

  private readonly logger: Logger = LoggerFactory.createLogger(AppService.name);

  constructor(@Inject('WORKER') private worker: ClientProxy) {}

  async startWorker(
    streamDescription: StreamDescriptionDto,
  ): Promise<Response> {
    this.streamDescription = streamDescription;
    this.logger.debug(
      `Sending a start request to the worker: ${streamDescription.adapter}`,
    );
    const success: Observable<Response> = this.worker
      .send('start', streamDescription)
      .pipe(timeout(5000));
    const result = await lastValueFrom(success);
    return result;
  }

  async restartWorker(): Promise<Response> {
    return await this.startWorker(this.streamDescription);
  }

  async stopWorker(): Promise<Response> {
    this.logger.debug(`Sending a stop request to the worker.`);
    const success: Observable<Response> = this.worker
      .send('stop', {})
      .pipe(timeout(5000));
    const result = await lastValueFrom(success);
    return result;
  }
}
