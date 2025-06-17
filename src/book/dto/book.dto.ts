import { Expose, Transform, Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class BookDto {
  @Expose()
  @IsMongoId()
  @Transform(({ value }: { value: string }) => value.toString())
  readonly _id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly author: string;

  @Expose()
  @Type(() => Date)
  readonly createdAt: Date;

  @Expose()
  @Type(() => Date)
  readonly updatedAt: Date;
}
