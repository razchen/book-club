import { Expose, Transform, Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class BookClubSubjectDto {
  @Expose()
  @Transform(({ value }: { value: Types.ObjectId }) => value.toString())
  @IsMongoId()
  readonly _id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @Expose()
  @IsMongoId()
  readonly owner: string;

  @Expose()
  @Type(() => Date)
  readonly createdAt: Date;

  @Expose()
  @Type(() => Date)
  readonly updatedAt: Date;
}
