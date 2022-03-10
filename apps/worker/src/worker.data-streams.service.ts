import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoggerFactory } from 'apps/util/util.logger.factory';
import { lastValueFrom, Observable, timeout } from 'rxjs';
import { WorkerConfigDto } from './worker.config.dto';

@Injectable()
export class DataStreamsService implements OnModuleInit {

    private readonly logger: Logger = LoggerFactory.createLogger(DataStreamsService.name)

    constructor(@Inject('DATA-STREAMS') private dataStreams: ClientProxy) { }

    async announce() {
        this.logger.log('Started up, announcing liveness to data-streams.')
        const success: Observable<boolean> = this.dataStreams.emit('worker_available', {}).pipe(timeout(5000));
        const result = await lastValueFrom(success)
        return result
    }

    onModuleInit() { this.announce() }

}
