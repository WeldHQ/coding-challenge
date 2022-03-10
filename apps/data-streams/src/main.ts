import { NestFactory } from '@nestjs/core';
import { LoggerFactory } from 'apps/util/util.logger.factory';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(LoggerFactory.createLogger(AppModule.name));
  await app.listen(process.env.APP_PORT);
}

bootstrap();
