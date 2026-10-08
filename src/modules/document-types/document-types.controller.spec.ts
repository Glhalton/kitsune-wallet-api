import { Test, TestingModule } from '@nestjs/testing';
import { DocumentTypesController } from './document-types.controller.js';
import { DocumentTypesService } from './document-types.service.js';

describe('DocumentTypesController', () => {
  let controller: DocumentTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentTypesController],
      providers: [{ provide: DocumentTypesService, useValue: {} }],
    }).compile();

    controller = module.get<DocumentTypesController>(DocumentTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
