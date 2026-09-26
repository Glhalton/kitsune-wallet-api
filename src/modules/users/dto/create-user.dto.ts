import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { Trim } from '../../../common/validation/trim.decorator.js';
import { Lowercase } from '../../../common/validation/lowercase.decorator.js';

export class CreateUserDto {
  @IsString()
  @Trim()
  @MinLength(2)
  @MaxLength(250)
  name: string;

  @IsEmail()
  @Lowercase()
  @Trim()
  email: string;

  @MinLength(4)
  @MaxLength(40)
  @IsString()
  password: string;
}
