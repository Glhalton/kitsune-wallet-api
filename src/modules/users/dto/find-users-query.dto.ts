import { IsEmail, IsOptional } from 'class-validator';

export class FindUsersQueryDto {
  @IsOptional()
  @IsEmail()
  email?: string;
}
