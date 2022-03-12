import { Controller, Logger, UseFilters } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { GrpcExceptionsFilter } from 'apps/util/grpcExceptions.filter';
import { LoggerFactory } from 'apps/util/util.logger.factory';
import { AppService } from './app.service';

@Controller()
@UseFilters(GrpcExceptionsFilter)
export class TcpController {

  private readonly logger: Logger = LoggerFactory.createLogger(TcpController.name)

  constructor(private readonly appService: AppService) { }

  @EventPattern('worker_available')
  async workerAvailable(): Promise<string> {
    try {
      return JSON.stringify(await this.appService.restartWorker());
    } catch (e) {
      this.logger.error(e)
      this.logger.error("Worker restart failed. No stream definition provided")
    }
  }

}