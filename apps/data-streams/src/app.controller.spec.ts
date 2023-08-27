import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  const mockClientProxy = {
    emit: jest.fn(),
  };

  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: 'WORKER_SERVICE', useValue: mockClientProxy },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('startFetching', () => {
    it('should start fetching data', () => {
      const result = 'Started fetching data every 300000 milliseconds.';
      expect(appController.startFetching()).toBe(result);
    });
  });

  describe('stopFetching', () => {
    it('should stop fetching data', () => {
      const result = 'Stopped fetching data.';
      expect(appController.stopFetching()).toBe(result);
    });
  });

  describe('getData', () => {
    it('should fetch data', () => {
      const result = [];
      jest.spyOn(appService, 'getData').mockImplementation(() => result);
      expect(appController.getData()).toBe(result);
    });
  });
});
