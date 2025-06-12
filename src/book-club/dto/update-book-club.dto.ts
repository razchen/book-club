import { PartialType } from '@nestjs/mapped-types';
import { CreateBookClubDto } from './create-book-club.dto';

export class UpdateBookClubDto extends PartialType(CreateBookClubDto) {}
