import { Module } from '@nestjs/common';
import { DocumentFilesService } from './document-files.service.js';
import { DocumentFilesController } from './document-files.controller.js';

@Module({
  controllers: [DocumentFilesController],
  providers: [DocumentFilesService],
})
export class DocumentFilesModule {}
