import { Injectable, Logger } from '@nestjs/common';
import { LoggerFactory } from 'apps/util/util.logger.factory';

@Injectable()
export class DataStoreProvider {
  private readonly logger: Logger = LoggerFactory.createLogger(
    DataStoreProvider.name,
  );
  private readonly datastore: Record<string, Array<Record<string, any>>> = {};

  get(streamName: string) {
    if (!this.datastore.hasOwnProperty(streamName)) {
      throw new Error(`The datastore does not contain stream: ${streamName}`);
    }
    return this.datastore[streamName];
  }

  append(streamName: string, data: any): Array<any> {
    if (this.datastore.hasOwnProperty(streamName)) {
      this.datastore[streamName].push(data);
    } else {
      this.logger.log(`Created a new datastore namespace for ${streamName}`);
      this.datastore[streamName] = [data];
    }
    return this.get(streamName);
  }
}
