import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class AppService {

  constructor(@Inject('WORKER') private worker: ClientProxy) { }

  startWorker() {
  }
}
