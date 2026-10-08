import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateElectoralCardDto } from './create-electoral-card.dto.js';

export class UpdateElectoralCardDto extends PartialType(
  OmitType(CreateElectoralCardDto, ['documentId']),
) {}
