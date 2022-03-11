import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Config } from 'apps/util/config.service';
import { LoggerModule } from 'nestjs-pino';
import { IQAirProvider } from './iqair.provider';
import { WorkerController } from './worker.controller';
import { DataStreamsConnectionFactory } from './worker.data-streams.connection.factory';
import { DataStreamsService } from './worker.data-streams.service';
import { WorkerService } from './worker.service';

@Module({
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: true }),
    LoggerModule.forRoot(),
    HttpModule
  ],
  controllers: [WorkerController],
  providers: [
    WorkerService,
    Config,
    {
      provide: 'DATA-STREAMS',
      useFactory: DataStreamsConnectionFactory.create,
      inject: [Config],
    },
    DataStreamsService,
    IQAirProvider
  ],
})
export class WorkerModule { }
