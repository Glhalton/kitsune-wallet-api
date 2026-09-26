import { IsEmail, IsString, MaxLength, Min } from 'class-validator';
import { Trim } from '../../../common/validation/trim.decorator.js';

export class CreateUserDto {
  @IsString()
  @Min(2)
  @Trim()
  @MaxLength(250)
  name: string;

  @IsEmail()
  email: string;

  @Min(2)
  @MaxLength(250)
  password: string;
}
