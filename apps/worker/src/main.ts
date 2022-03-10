import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { LoggerFactory } from 'apps/util/util.logger.factory';

async function bootstrap() {
  const app = await NestFactory.create(WorkerModule);
  app.useLogger(LoggerFactory.createLogger(WorkerModule.name));
  await app.listen(process.env.WORKER_PORT);
}
bootstrap();