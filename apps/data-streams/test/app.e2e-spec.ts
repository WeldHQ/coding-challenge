import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let client: ClientProxy;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ClientsModule.register([
          { name: 'DATA_STREAMS_MS', transport: Transport.TCP },
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.connectMicroservice({ transport: Transport.TCP });

    await app.startAllMicroservicesAsync();
    await app.init();

    client = app.get('DATA_STREAMS_MS');
    await client.connect();
  });

  afterEach((done) => {
    client.close();
    app.close();
    done();
  });

  it('[GET] /private/results/TEST returns data', async (done) => {
    const message = {
      adapter: 'TEST',
      timestamp: 12345678,
      payload: {
        id: 'id1',
        filename: 'filename.json',
        rawData: { message: 1 },
      },
    };
    const emitter: Observable<any> = client.emit('results', message);
    await emitter.subscribe();

    const response = await request(app.getHttpServer())
      .get('/private/results/TEST')
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ data: [{ message: 1 }] });
    done();
  });

  it('[GET] /private/results/TEST returns multiple pieces of data in order', async (done) => {
    const message = {
      adapter: 'TEST',
      timestamp: 12345678,
      payload: {
        id: 'id1',
        filename: 'filename.json',
        rawData: { message: 1 },
      },
    };
    const emitter: Observable<any> = client.emit('results', message);
    await emitter.subscribe();

    const message2 = {
      adapter: 'TEST',
      timestamp: 12345678,
      payload: {
        id: 'id1',
        filename: 'filename.json',
        rawData: { message: 2 },
      },
    };
    const emitter2: Observable<any> = client.emit('results', message2);
    await emitter2.subscribe();

    const response = await request(app.getHttpServer())
      .get('/private/results/TEST')
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      data: [{ message: 1 }, { message: 2 }],
    });
    done();
  });

  it('[GET] /private/results/TEST returns a 404 response when no data', async (done) => {
    const response = await request(app.getHttpServer())
      .get('/private/results/TEST')
      .send();

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual(
      'The datastore does not contain stream: TEST',
    );
    done();
  });
});
