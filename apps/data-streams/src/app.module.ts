import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Config } from './app.config.service';
import { WorkerConnectionFactory } from './app.worker.connection.factory';
import { LoggerModule } from 'nestjs-pino';
import { TcpController } from './app.tcp.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: true }),
    LoggerModule.forRoot()
  ],
  controllers: [AppController, TcpController],
  providers: [
    AppService,
    Config,
    {
      provide: 'WORKER',
      useFactory: WorkerConnectionFactory.create,
      inject: [Config],
    }
  ]
})
export class AppModule { }
