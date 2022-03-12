import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Payload, ResultsDto } from 'apps/util/results.dto';
import { Response } from 'apps/util/response.dto';
import { LoggerFactory } from 'apps/util/util.logger.factory';
import { lastValueFrom, Observable, timeout } from 'rxjs';

@Injectable()
export class DataStreamsService implements OnModuleInit {

    private readonly logger: Logger = LoggerFactory.createLogger(DataStreamsService.name)

    constructor(@Inject('DATA-STREAMS') private dataStreams: ClientProxy) { }

    async emitResults(streamName: string, results: object) {
        this.logger.log('Posting new results to data-streams.')
        const resultsDto = new ResultsDto(
            streamName,
            new Payload('noop-id', 'noop-filename', results)
        )

        const success: Observable<Response> = this.dataStreams
            .emit('results', resultsDto)
            .pipe(timeout(5000));
        return await lastValueFrom(success)
    }

    async announce() {
        this.logger.log('Started up, announcing liveness to data-streams.')
        const success: Observable<boolean> = this.dataStreams
            .emit('worker_available', {})
            .pipe(timeout(5000));
        const result = await lastValueFrom(success)
        return result
    }

    onModuleInit() { this.announce() }

}
