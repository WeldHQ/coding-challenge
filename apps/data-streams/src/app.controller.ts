import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  UseFilters,
} from '@nestjs/common';
import { Response } from '../../util/response.dto';
import { StreamDescriptionDto } from '../../util/streamDescription.dto';
import { HttpExceptionsFilter } from '../../util/httpExceptions.filter';
import { DataStoreProvider } from './app.datastore.provider';
import { AppService } from './app.service';
import { Config } from '../../util/config.service';
import { HttpException as InternalHttpException } from '../../util/http.exception.dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdapterType } from '../../worker/src/adapters/adapterType.enum';

@Controller('private')
@ApiExtraModels(InternalHttpException)
@UseFilters(HttpExceptionsFilter)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly datastore: DataStoreProvider,
    private readonly config: Config,
  ) {}

  /**
   * Immediately sends the start command to the remote worker.<br><br>
   * Along with the start command, it also relays the stream's definition.
   * In a happy path scenario, the worker will accept the stream definition
   * and schedule the job.<br><br>Error scenarios usually include the
   * inability to communicate with the worker, or the definition misconfiguration.
   */
  @Get('start')
  @ApiTags('worker-operations')
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description:
      'A misconfiguration had occured or the worker could not be contacted.',
  })
  startWorker(): Promise<Response> {
    const workerDefinition = new StreamDescriptionDto(
      AdapterType.IQAIR_DAILY,
      300000, // 5 minutes
      30000, // 30 seconds
      this.config.IQAIR_CONFIG,
    );

    const response = this.appService.startWorker(workerDefinition);
    return response;
  }

  /**
   * Immediately sends the stop command to the remote worker.<br><br>
   * In a happy path scenario, the worker will interrupt any operations
   * and stop the fetching job. It will not destroy the worker itself.<br>
   * Error scenarios usually include the inability to communicate with the worker.
   */
  @Get('stop')
  @ApiTags('worker-operations')
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'The worker could not be communicated with.',
  })
  stopWorker(): Promise<Response> {
    return this.appService.stopWorker();
  }

  /**
   * Used for fetching the stored stream results based on the unique stream handle.<br><br>
   * The endpoint is idempotent and will return an empty list in case an unknown handle is provided.
   */
  @Get('results/:streamName')
  @ApiTags('results')
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:
      'The datastore does not contain a stream with the given handle.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description:
      'The datastore itself is corrupt, non-responsive or unavailable.',
  })
  results(@Param('streamName') streamName: string): Record<string, unknown> {
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
