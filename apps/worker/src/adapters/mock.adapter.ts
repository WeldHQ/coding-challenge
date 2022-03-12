import { Logger } from '@nestjs/common';
import { LoggerFactory } from 'apps/util/util.logger.factory';
import { Adapter } from './adapter.abstract';

export class MockAdapter extends Adapter {
  protected readonly logger: Logger = LoggerFactory.createLogger(
    MockAdapter.name,
  );

  async fetch(): Promise<object> {
    this.logger.debug('Fetching new data from Mock Adapter.');
    return { status: true, data: [] };
  }
}
