import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Config } from './app.config.service';
import { WorkerFactory } from './app.worker.factory';

@Module({
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: true }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Config,
    Logger,
    {
      provide: 'WORKER',
      useFactory: WorkerFactory.create,
      inject: [Config, Logger],
    }
  ]
})
export class AppModule { }
