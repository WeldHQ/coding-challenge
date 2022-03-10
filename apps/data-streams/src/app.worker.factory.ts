import { Logger } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { LoggerFactory } from "apps/util/util.logger.factory";
import { Config } from "./app.config.service";

export class WorkerFactory {

    public static create(config: Config) {
        const logger: Logger = LoggerFactory.createLogger(WorkerFactory.name);
        const host: string = config.WORKER_HOST
        const port: number = config.WORKER_PORT

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