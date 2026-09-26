import { Module } from '@nestjs/common';
import { DocumentTypesService } from './document-types.service.js';
import { DocumentTypesController } from './document-types.controller.js';

@Module({
  controllers: [DocumentTypesController],
  providers: [DocumentTypesService],
})
export class DocumentTypesModule {}
