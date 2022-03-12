import { HttpService } from '@nestjs/axios';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { StreamDescriptionDto } from '../../../util/streamDescription.dto';
import { WorkerModule } from '../worker.module';
import { IQAirAdapter } from './iqair.adapter';

describe('WorkerController', () => {
  let app: INestApplication;
  let httpService: HttpService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WorkerModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpService = app.get(HttpService);
  });

  afterEach((done) => {
    app.close();
    done();
  });

  it('should throw an error with wrong credentials', async (done) => {
    const adapter = new IQAirAdapter(
      new StreamDescriptionDto('IQAIR_DAILY', 3000, 3000, {
        origin: 'http://api.airvisual.com',
        secretKey: 'mykey',
      }),
      httpService,
    );

    try {
      await adapter.fetch();
    } catch (e) {
      expect(e).toEqual(
        new Error('{"status":"fail","data":{"message":"incorrect_api_key"}}'),
      );
    }

    done();
  });

  it('will return parsed data on success', async (done) => {
    const adapter = new IQAirAdapter(
      new StreamDescriptionDto('IQAIR_DAILY', 3000, 3000, {
        origin: '',
        secretKey: '',
      }),
      httpService,
    );

    const currentPollutionData = {
      ts: '2019-08-04T03:00:00.000Z;',
      aqius: 1,
      mainus: 'pm2',
      aqicn: 1,
      maincn: 'pm2',
    };

    const apiResponse: AxiosResponse = {
      data: { data: { current: { pollution: currentPollutionData } } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    jest
      .spyOn(httpService, 'get')
      .mockImplementationOnce(() => of(apiResponse));

    expect(await adapter.fetch()).toMatchObject(currentPollutionData);
    done();
  });
});
