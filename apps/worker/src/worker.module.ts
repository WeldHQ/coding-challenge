import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { Config } from './worker.config.service';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';

@Module({
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: true }),
    LoggerModule.forRoot()
  ],
  controllers: [WorkerController],
  providers: [
    WorkerService,
    Config
  ],
})
export class WorkerModule { }
