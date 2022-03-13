import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { Config } from '../../util/config.service';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  startSwagger(app);

  await app.startAllMicroservices();
  await app.listen(config.APP_HTTP_PORT, () => {
    logger.log(
      `Data Streams started. Listening on port: ${config.APP_HTTP_PORT}`,
    );
  });
}

function startSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Weld Challenge')
    .setDescription(
      'Description of an API that manager the remote worker component.',
    )
    .setVersion('1.0')
    .addTag('data-streams')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

bootstrap();
