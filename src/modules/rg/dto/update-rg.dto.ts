import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateRgDto } from './create-rg.dto.js';

export class UpdateRgDto extends PartialType(
  OmitType(CreateRgDto, ['documentId']),
) {}
