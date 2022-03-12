import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { WorkerModule } from '../src/worker.module';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';

describe('WorkerController (e2e)', () => {
  let app: INestApplication;
  let client: ClientProxy;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        WorkerModule,
        ClientsModule.register([
          {
            name: 'WORKER_MS',
            transport: Transport.TCP,
            options: {
              host: '0.0.0.0',
              port: 3001,
            },
          },
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.connectMicroservice({
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3001,
      },
    });

    await app.startAllMicroservicesAsync();
    await app.init();
    client = app.get('WORKER_MS');
    await client.connect();
  });

  afterEach((done) => {
    client.close();
    app.close();
    done();
  });

  it('[Message] start starts a worker', async (done) => {
    const message = {
      adapter: 'MOCK',
      interval: 10000,
      timeout: 3000,
    };
    const emitter: Observable<any> = client.send('start', message);
    const workerResponse = await lastValueFrom(emitter);

    expect(workerResponse).toMatchObject({
      success: true,
      message: 'Started fetching from adapter MOCK.',
    });
    done();
  });
});
