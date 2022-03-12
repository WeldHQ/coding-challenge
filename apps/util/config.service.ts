import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IQAirConfig } from '../worker/src/adapters/iqair.adapter';

@Injectable()
export class Config {
  readonly NODE_ENV: string;
  readonly APP_HOST: string;
  readonly APP_HTTP_PORT: number;
  readonly APP_TCP_PORT: number;
  readonly WORKER_HOST: string;
  readonly WORKER_TCP_PORT: number;
  readonly IQAIR_CONFIG: IQAirConfig;

  constructor(@Inject(ConfigService) private configService: ConfigService) {
    this.NODE_ENV = configService.get<string>('NODE_ENV');
    this.APP_HOST = configService.get<string>('APP_HOST');
    this.APP_HTTP_PORT = parseInt(configService.get<string>('APP_HTTP_PORT'));
    this.APP_TCP_PORT = parseInt(configService.get<string>('APP_TCP_PORT'));
    this.WORKER_HOST = configService.get<string>('WORKER_HOST');
    this.WORKER_TCP_PORT = parseInt(
      configService.get<string>('WORKER_TCP_PORT'),
    );

    this.IQAIR_CONFIG = {
      lat: 55.6758447,
      lon: 12.5727742,
      origin: 'http://api.airvisual.com',
      secretKey: configService.get<string>('IQAIR_API_KEY'),
    };
  }
}
