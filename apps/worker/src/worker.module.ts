import { Module } from '@nestjs/common';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DATA_STREAMS_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3000,
        },
      },
    ]),
    HttpModule,
  ],
  controllers: [WorkerController],
  providers: [WorkerService],
})
export class WorkerModule {}
