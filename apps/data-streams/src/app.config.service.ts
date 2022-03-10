import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Config {
    readonly NODE_ENV: string;
    readonly APP_PORT: number;
    readonly WORKER_HOST: string;
    readonly WORKER_PORT: number;

    constructor(@Inject(ConfigService) private configService: ConfigService) {
        this.NODE_ENV = configService.get<string>('NODE_ENV')
        this.APP_PORT = parseInt(configService.get<string>('APP_PORT'))
        this.WORKER_HOST = configService.get<string>('WORKER_HOST')
        this.WORKER_PORT = parseInt(configService.get<string>('WORKER_PORT'))
    }
}
