import { Test, TestingModule } from '@nestjs/testing';
import { InfoController } from './controllers/InfoController';
import { InfoService } from './services/InfoService';

describe('AppController', () => {
  let appController: InfoController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [InfoController],
      providers: [InfoService],
    }).compile();

    appController = app.get<InfoController>(InfoController);
  });

  describe('root', () => {
    it('should return "Nest js test project"', () => {
      expect(appController.getInfo()).toBe('Nest js test project');
    });
  });
});
