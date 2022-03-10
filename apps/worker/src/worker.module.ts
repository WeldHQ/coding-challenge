import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { Config } from './worker.config.service';
import { WorkerController } from './worker.controller';
import { DataStreamsConnectionFactory } from './worker.data-streams.connection.factory';
import { WorkerService } from './worker.service';

@Module({
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: true }),
    LoggerModule.forRoot()
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
    Config
  ],
})
export class WorkerModule { }
