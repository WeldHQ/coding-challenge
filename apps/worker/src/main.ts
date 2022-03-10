import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { LoggerFactory } from 'apps/util/util.logger.factory';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from './worker.config.service';
import { ValidationPipe } from 'apps/util/validation.pipe';

async function bootstrap() {
  const logger: Logger = LoggerFactory.createLogger('main')
  const config = new Config(new ConfigService())

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WorkerModule,
    {
      transport: Transport.TCP,
      options: { host: '0.0.0.0', port: config.WORKER_TCP_PORT }
    },
  );
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(logger);
  await app.listen(() => { logger.log(`Worker started. Listening on port: ${config.WORKER_TCP_PORT}`) });
}

bootstrap();