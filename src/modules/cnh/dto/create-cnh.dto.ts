import {
  IsDateString,
  IsInt,
  IsPositive,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Trim } from '../../../common/validation/trim.decorator.js';

export class CreateCnhDto {
  @IsInt()
  @IsPositive()
  documentId: number;

  @IsString()
  @Trim()
  @MinLength(1)
  @MaxLength(20)
  registerNumber: string;

  @IsString()
  @Trim()
  @Length(1, 5)
  category: string;

  @IsDateString()
  expirationDate: string;

  @IsDateString()
  issueDate: string;
}
