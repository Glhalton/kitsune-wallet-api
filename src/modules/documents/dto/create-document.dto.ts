import { IsInt, IsPositive } from 'class-validator';

export class CreateDocumentDto {
  @IsInt()
  @IsPositive()
  typeId: number;
}
