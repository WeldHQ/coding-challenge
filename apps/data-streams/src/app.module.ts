import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Config } from './app.config.service';
import { WorkerFactory } from './app.worker.factory';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: true }),
    LoggerModule.forRoot()
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Config,
    {
      provide: 'WORKER',
      useFactory: WorkerFactory.create,
      inject: [Config],
    }
  ]
})
export class AppModule { }
