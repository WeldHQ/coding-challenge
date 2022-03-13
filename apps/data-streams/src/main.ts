import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { LoggerFactory } from '../../util/util.logger.factory';
import { Config } from '../../util/config.service';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const config = new Config(new ConfigService());

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger: Logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.connectMicroservice({
    transport: Transport.TCP,
    options: { host: '0.0.0.0', port: config.APP_TCP_PORT },
  });


  await app.startAllMicroservices();
  await app.listen(config.APP_HTTP_PORT, () => {
    logger.log(
      `Data Streams started. Listening on port: ${config.APP_HTTP_PORT}`,
    );
  });
}

bootstrap();
