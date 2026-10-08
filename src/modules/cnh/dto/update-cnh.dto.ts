import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCnhDto } from './create-cnh.dto.js';

export class UpdateCnhDto extends PartialType(
  OmitType(CreateCnhDto, ['documentId']),
) {}
