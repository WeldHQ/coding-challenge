import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';

describe('WorkerController', () => {
  const mockHttpService = {
    get: jest.fn().mockReturnThis(),
    toPromise: jest.fn().mockResolvedValueOnce({ data: {} }),
  };

  const mockDataStreamsService = {
    emit: jest.fn(),
    send: jest.fn(),
    connect: jest.fn(),
  };

  let workerController: WorkerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [WorkerController],
      providers: [
        WorkerService,
        { provide: 'DATA_STREAMS_SERVICE', useValue: mockDataStreamsService },
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    workerController = app.get<WorkerController>(WorkerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(workerController.getHello()).toBe('Hello World!');
    });
  });
});
