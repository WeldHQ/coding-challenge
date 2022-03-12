import { Logger } from '@nestjs/common';

export class LoggerFactory {
  public static createLogger(moduleName: string) {
    return new Logger(moduleName, true);
  }
}
