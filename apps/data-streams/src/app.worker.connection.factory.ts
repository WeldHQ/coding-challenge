import { Logger } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { LoggerFactory } from 'apps/util/util.logger.factory';
import { Config } from '../../util/config.service';

export class WorkerConnectionFactory {
  public static create(config: Config) {
    const logger: Logger = LoggerFactory.createLogger(
      WorkerConnectionFactory.name,
    );
    const host: string = config.WORKER_HOST;
    const port: number = config.WORKER_TCP_PORT;

    logger.debug(`Registering microservice connection: ${host}:${port} `);
    return ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: host,
        port: port,
      },
    });
  }
}
