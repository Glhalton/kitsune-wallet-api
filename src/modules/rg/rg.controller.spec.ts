import { Test, TestingModule } from '@nestjs/testing';
import { RgController } from './rg.controller.js';
import { RgService } from './rg.service.js';

describe('RgController', () => {
  let controller: RgController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RgController],
      providers: [{ provide: RgService, useValue: {} }],
    }).compile();

    controller = module.get<RgController>(RgController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
