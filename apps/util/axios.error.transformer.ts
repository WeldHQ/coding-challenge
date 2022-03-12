import { Logger } from '@nestjs/common';
import { ObservableInput } from 'rxjs';

export abstract class AxiosErrorTransformer {
  /**
   * Axios errors can be notoriously had to catch,
   * especially with async functions.
   *
   * From AXIOS docs `https://github.com/axios/axios#handling-errors`.
   *
   * This helper is supposed to ease the pain behave
   * predictably when it comes to exception message formatting.
   */
  public static transform(
    logger: Logger,
    error,
    outputTransfomer = JSON.stringify,
  ): ObservableInput<any> {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      logger.error('Received a non 200 status code.');
      logger.error(outputTransfomer(error.response.data));
      throw new Error(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      logger.error('The request was made but no response was received.');
      logger.error(error.request);
      throw new Error(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      logger.error('Request setup failed.');
      logger.error(error.message);
      throw new Error(error.message);
    }
  }
}
