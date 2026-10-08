import { Test, TestingModule } from '@nestjs/testing';
import { CnhController } from './cnh.controller.js';
import { CnhService } from './cnh.service.js';

describe('CnhController', () => {
  let controller: CnhController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CnhController],
      providers: [{ provide: CnhService, useValue: {} }],
    }).compile();

    controller = module.get<CnhController>(CnhController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
