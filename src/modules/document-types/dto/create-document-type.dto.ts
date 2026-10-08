import { IsString, MaxLength, MinLength } from 'class-validator';
import { Trim } from '../../../common/validation/trim.decorator.js';

export class CreateDocumentTypeDto {
  @IsString()
  @Trim()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @Trim()
  @MinLength(2)
  @MaxLength(250)
  description: string;
}
