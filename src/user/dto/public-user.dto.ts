import { Expose } from 'class-transformer';

export class PublicUserDto {
  @Expose()
  name: string;
}
