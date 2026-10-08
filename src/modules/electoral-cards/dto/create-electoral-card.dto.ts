import {
  IsInt,
  IsPositive,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Trim } from '../../../common/validation/trim.decorator.js';

export class CreateElectoralCardDto {
  @IsInt()
  @IsPositive()
  documentId: number;

  @IsString()
  @Trim()
  @MinLength(1)
  @MaxLength(20)
  voterRegistration: string;

  @IsInt()
  @IsPositive()
  zone: number;

  @IsInt()
  @IsPositive()
  section: number;

  @IsString()
  @Trim()
  @MinLength(2)
  @MaxLength(100)
  electoralCity: string;

  @IsString()
  @Trim()
  @Length(2, 2)
  electoralState: string;
}
