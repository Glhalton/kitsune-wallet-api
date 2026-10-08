import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateDocumentFileDto } from './create-document-file.dto.js';

export class UpdateDocumentFileDto extends PartialType(
  OmitType(CreateDocumentFileDto, ['documentId']),
) {}
