import { Logger } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { LoggerFactory } from "apps/util/util.logger.factory";
import { Config } from "./worker.config.service";

export class DataStreamsConnectionFactory {

    public static create(config: Config) {
        const logger: Logger = LoggerFactory.createLogger(DataStreamsConnectionFactory.name);
        const host: string = config.APP_HOST
        const port: number = config.APP_TCP_PORT

        logger.debug(`Registering microservice connection: ${host}:${port} `)
        return ClientProxyFactory.create({
            transport: Transport.TCP,
            options: {
                host: host,
                port: port,
            },
        })
    }

}