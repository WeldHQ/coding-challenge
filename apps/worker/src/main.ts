import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { LoggerFactory } from 'apps/util/util.logger.factory';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger: Logger = LoggerFactory.createLogger(WorkerModule.name)
  const port: number = parseInt(process.env.WORKER_PORT)

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WorkerModule,
    {
      transport: Transport.TCP,
      options: { host: '0.0.0.0', port: port }
    },
  );
  app.useLogger(logger);
  await app.listen(() => { logger.log(`Worker started. Listening on port: ${port}`) });
}

bootstrap();