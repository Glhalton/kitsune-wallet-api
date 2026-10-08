import { Test, TestingModule } from '@nestjs/testing';
import { DocumentFilesController } from './document-files.controller.js';
import { DocumentFilesService } from './document-files.service.js';

describe('DocumentFilesController', () => {
  let controller: DocumentFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentFilesController],
      providers: [{ provide: DocumentFilesService, useValue: {} }],
    }).compile();

    controller = module.get<DocumentFilesController>(DocumentFilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
