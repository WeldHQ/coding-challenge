import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Config {
    readonly NODE_ENV: string;
    readonly APP_HOST: string;
    readonly APP_HTTP_PORT: number;
    readonly APP_TCP_PORT: number;
    readonly WORKER_HOST: string;
    readonly WORKER_TCP_PORT: number;

    constructor(@Inject(ConfigService) private configService: ConfigService) {
        this.NODE_ENV = configService.get<string>('NODE_ENV')
        this.APP_HOST = configService.get<string>('APP_HOST')
        this.APP_HTTP_PORT = parseInt(configService.get<string>('APP_HTTP_PORT'))
        this.APP_TCP_PORT = parseInt(configService.get<string>('APP_TCP_PORT'))
        this.WORKER_HOST = configService.get<string>('WORKER_HOST')
        this.WORKER_TCP_PORT = parseInt(configService.get<string>('WORKER_TCP_PORT'))
    }
}
