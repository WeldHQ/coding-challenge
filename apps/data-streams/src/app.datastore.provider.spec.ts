import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { DataStoreProvider } from './app.datastore.provider';

describe('DataStoreProvider', () => {
  let app: INestApplication;
  let provider: DataStoreProvider;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    provider = app.get(DataStoreProvider);
  });

  afterEach((done) => {
    app.close();
    done();
  });

  it('append inserts data into a namespace', () => {
    provider.append('streamName', { data: 1 });
    provider.append('streamName', { data: 1 });
    expect(provider.get('streamName')).toMatchObject([
      { data: 1 },
      { data: 1 },
    ]);
  });

  it('get throws when scope does not exist', () => {
    expect(() => provider.get('streamName')).toThrow(
      'The datastore does not contain stream: streamName',
    );
  });

  it('get returns existing data', () => {
    provider.append('streamName', { data: 1 });
    expect(provider.get('streamName')).toMatchObject([{ data: 1 }]);
  });
});
