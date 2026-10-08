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

export class CreateRgDto {
  @IsInt()
  @IsPositive()
  documentId: number;

  @IsString()
  @Trim()
  @MinLength(2)
  @MaxLength(100)
  issuingAuthority: string;

  @IsString()
  @Trim()
  @MinLength(1)
  @MaxLength(20)
  registerNumber: string;

  @IsString()
  @Trim()
  @Length(11, 14)
  cpf: string;

  @IsString()
  @Trim()
  @MinLength(1)
  @MaxLength(50)
  militaryCertification: string;

  @IsString()
  @Trim()
  @Length(2, 2)
  uf: string;

  @IsDateString()
  issueDate: string;
}
