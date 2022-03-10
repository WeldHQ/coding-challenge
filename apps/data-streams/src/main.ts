import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { LoggerFactory } from 'apps/util/util.logger.factory';
import { Config } from './app.config.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger: Logger = LoggerFactory.createLogger('main')
  const config = new Config(new ConfigService())

  const app = await NestFactory.create(AppModule)
  app.useLogger(LoggerFactory.createLogger(AppModule.name));
  await app.listen(
    config.APP_PORT,
    () => { logger.log(`Data Streams started. Listening on port: ${config.WORKER_PORT}`) }
  );
}

bootstrap();
