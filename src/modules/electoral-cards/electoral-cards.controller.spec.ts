import { Test, TestingModule } from '@nestjs/testing';
import { ElectoralCardsController } from './electoral-cards.controller.js';
import { ElectoralCardsService } from './electoral-cards.service.js';

describe('ElectoralCardsController', () => {
  let controller: ElectoralCardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElectoralCardsController],
      providers: [{ provide: ElectoralCardsService, useValue: {} }],
    }).compile();

    controller = module.get<ElectoralCardsController>(ElectoralCardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
