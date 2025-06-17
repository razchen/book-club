import { Expose, Transform, Type } from 'class-transformer';
import { IsMongoId, IsString } from 'class-validator';

export class UserDto {
  @Expose()
  @IsMongoId()
  @Transform(({ value }: { value: string }) => value.toString())
  readonly _id: string;

  @Expose()
  name: string;

  @IsString()
  @Expose()
  email: string;

  @IsString()
  password: string;

  @Expose()
  @Type(() => Date)
  readonly createdAt: Date;

  @Expose()
  @Type(() => Date)
  readonly updatedAt: Date;
}
