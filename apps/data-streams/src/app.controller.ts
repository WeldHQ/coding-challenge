import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  UseFilters,
} from '@nestjs/common';
import { Response } from 'apps/util/response.dto';
import { StreamDescriptionDto } from 'apps/util/streamDescription.dto';
import { LoggerFactory } from 'apps/util/util.logger.factory';
import { HttpExceptionsFilter } from '../../util/httpExceptions.filter';
import { DataStoreProvider } from './app.datastore.provider';
import { AppService } from './app.service';

@Controller('private')
@UseFilters(HttpExceptionsFilter)
export class AppController {
  private readonly logger: Logger = LoggerFactory.createLogger(
    AppController.name,
  );

  constructor(
    private readonly appService: AppService,
    private readonly datastore: DataStoreProvider,
  ) {}

  @Get('start')
  startWorker(): Promise<Response> {
    // const workerDefinition = new StreamDescriptionDto("MOCK", 10000, 3000)

    const workerDefinition = new StreamDescriptionDto(
      'IQAIR_DAILY',
      300000, // 5 minutes
      30000, // 30 seconds
      {
        endpoint: 'http://api.airvisual.com/v2/nearest_city',
        secretKey: 'mykey',
      },
    );

    const response = this.appService.startWorker(workerDefinition);
    return response;
  }

  @Get('stop')
  stopWorker(): Promise<Response> {
    return this.appService.stopWorker();
  }

  @Get('results/:stream_name')
  results(@Param('stream_name') streamName: string): object {
    try {
      return { data: this.datastore.get(streamName) };
    } catch (e) {
      throw new NotFoundException(
        e,
        `Results for ${streamName} queried, but no such datastore entries available.`,
      );
    }
  }
}
