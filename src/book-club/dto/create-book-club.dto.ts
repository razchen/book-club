import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBookClubDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
