import { Expose, Type } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { BookDto } from 'src/book/dto/book.dto';

export class BookClubBookDto {
  @IsMongoId()
  readonly _id: string;

  @IsMongoId()
  readonly bookClub: string;

  @Expose()
  @Type(() => BookDto)
  readonly book?: BookDto;

  @Type(() => Date)
  readonly createdAt: Date;

  @Type(() => Date)
  readonly updatedAt: Date;
}
