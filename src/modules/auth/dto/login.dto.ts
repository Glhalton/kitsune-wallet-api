import { IsEmail, IsString, MaxLength } from 'class-validator';
import { Trim } from '../../../common/validation/trim.decorator.js';
import { Lowercase } from '../../../common/validation/lowercase.decorator.js';

export class LoginDto {
  @IsEmail()
  @Lowercase()
  @Trim()
  email: string;

  @IsString()
  @MaxLength(40)
  password: string;
}
