import { Expose, Type } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { PublicUserDto } from 'src/user/dto/public-user.dto';

export class MembershipDto {
  @IsMongoId()
  readonly _id: string;

  @IsMongoId()
  readonly bookClub: string;

  @Expose()
  @Type(() => PublicUserDto)
  readonly user: PublicUserDto;

  @Type(() => Date)
  readonly createdAt: Date;

  @Type(() => Date)
  readonly updatedAt: Date;
}
