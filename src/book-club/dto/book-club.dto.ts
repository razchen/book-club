import { Expose, Transform, Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { BookClubBookDto } from './book-club-book.dto';
import { PublicUserDto } from 'src/user/dto/public-user.dto';
import { Types } from 'mongoose';
import { MembershipDto } from './membership.dto';

export class BookClubDto {
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
  @Type(() => PublicUserDto)
  readonly owner: string;

  @Expose()
  @Type(() => Date)
  readonly createdAt: Date;

  @Expose()
  @Type(() => Date)
  readonly updatedAt: Date;

  @Expose()
  @Type(() => BookClubBookDto)
  readonly books: BookClubBookDto[];

  @Expose()
  @Type(() => MembershipDto)
  readonly users?: MembershipDto[];
}
