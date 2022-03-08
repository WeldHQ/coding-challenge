import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  startWorker(): string {
    const success = this.appService.startWorker()
    return JSON.stringify({ "success": success, "message": "Started fetching from adapter IQAIR_DAILY." });
  }
}
