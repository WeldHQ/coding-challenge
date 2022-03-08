import { NestFactory } from '@nestjs/core';
import { LoggerFactory } from './app.logger.factory';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(LoggerFactory.createLogger(AppModule.name));
  await app.listen(3000);
}

bootstrap();
