import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DocumentFilesService } from './document-files.service.js';
import { CreateDocumentFileDto } from './dto/create-document-file.dto.js';
import { UpdateDocumentFileDto } from './dto/update-document-file.dto.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/auth.guard.js';

@Controller('document-files')
export class DocumentFilesController {
  constructor(private readonly documentFilesService: DocumentFilesService) {}

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createDocumentFileDto: CreateDocumentFileDto,
  ) {
    return this.documentFilesService.create(user.id, createDocumentFileDto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.documentFilesService.findAll(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.documentFilesService.findOne(user.id, +id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateDocumentFileDto: UpdateDocumentFileDto,
  ) {
    return this.documentFilesService.update(
      user.id,
      +id,
      updateDocumentFileDto,
    );
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.documentFilesService.remove(user.id, +id);
  }
}
