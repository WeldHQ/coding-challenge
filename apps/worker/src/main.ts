import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { Config } from '../../util/config.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const config = new Config(new ConfigService());
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WorkerModule,
    {
      transport: Transport.TCP,
      options: { host: '0.0.0.0', port: config.WORKER_TCP_PORT },
    },
  );
  const logger: Logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen();
}

bootstrap();
