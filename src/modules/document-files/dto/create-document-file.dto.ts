import {
  IsInt,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Trim } from '../../../common/validation/trim.decorator.js';

export class CreateDocumentFileDto {
  @IsInt()
  @IsPositive()
  documentId: number;

  @IsString()
  @Trim()
  @MinLength(1)
  @MaxLength(500)
  storageKey: string;

  @IsString()
  @Trim()
  @MinLength(1)
  @MaxLength(100)
  mimeType: string;

  @IsInt()
  @IsPositive()
  size: number;
}
