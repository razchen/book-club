import { Module } from '@nestjs/common';
import { BookClubsController } from './book-club.controller';
import { BookClubService } from './book-club.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BookClub, BookClubSchema } from './schema/book-club.schema';
import {
  BookClubBook,
  BookClubBookSchema,
} from './schema/book-club-book.schema';
import { Membership, MembershipSchema } from './schema/membership.schema';
import { CaslModule } from 'nest-casl';
import { permissions } from './book-club.permission';

@Module({
  controllers: [BookClubsController],
  providers: [BookClubService],
  imports: [
    CaslModule.forFeature({ permissions }),
    MongooseModule.forFeature([
      { name: BookClub.name, schema: BookClubSchema },
      { name: BookClubBook.name, schema: BookClubBookSchema },
      { name: Membership.name, schema: MembershipSchema },
    ]),
  ],
})
export class BookClubModule {}
