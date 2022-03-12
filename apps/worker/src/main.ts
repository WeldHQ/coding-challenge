import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { LoggerFactory } from 'apps/util/util.logger.factory';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from 'apps/util/config.service';

async function bootstrap() {
  const logger: Logger = LoggerFactory.createLogger('main');
  const config = new Config(new ConfigService());

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WorkerModule,
    {
      transport: Transport.TCP,
      options: { host: '0.0.0.0', port: config.WORKER_TCP_PORT },
    },
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useLogger(logger);
  await app.listen(() => {
    logger.log(`Worker started. Listening on port: ${config.WORKER_TCP_PORT}`);
  });
}

bootstrap();
