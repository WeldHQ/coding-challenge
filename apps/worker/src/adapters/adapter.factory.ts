import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { StreamDescriptionDto } from '../../../util/streamDescription.dto';
import { IQAirAdapter } from './iqair.adapter';
import { MockAdapter } from './mock.adapter';

@Injectable()
export class AdapterFactory {
  constructor(private readonly httpService: HttpService) {}

  create(streamDescription: StreamDescriptionDto) {
    switch (streamDescription.adapter) {
      case 'IQAIR_DAILY':
        return new IQAirAdapter(streamDescription, this.httpService);
      case 'MOCK':
        return new MockAdapter(streamDescription);
      default:
        throw new Error(
          `${streamDescription.adapter} matches no available adapter names.`,
        );
    }
  }
}
