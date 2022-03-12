import { Logger } from '@nestjs/common';
import { ObservableInput } from 'rxjs';
import { AxiosErrorTransformer } from '../../../util/axios.error.transformer';
import { StreamDescriptionDto } from '../../../util/streamDescription.dto';

export abstract class Adapter {
  readonly name: string;
  readonly timeout: number;
  protected readonly logger: Logger;

  constructor(streamDescription: StreamDescriptionDto) {
    this.name = streamDescription.adapter;
    this.timeout = streamDescription.timeout;
  }

  protected transformAxiosError(
    error,
    outputTransfomer = JSON.stringify,
  ): ObservableInput<any> {
    return AxiosErrorTransformer.transform(
      this.logger,
      error,
      outputTransfomer,
    );
  }
}
