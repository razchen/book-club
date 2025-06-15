import { Module } from '@nestjs/common';
import { BookClubsController } from './book-club.controller';
import { BookClubsService } from './book-clubs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BookClub, BookClubSchema } from './schema/book-club.schema';
import {
  BookClubBook,
  BookClubBookSchema,
} from './schema/book-club-book.schema';
import { Membership, MembershipSchema } from './schema/membership.schema';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';

@Module({
  controllers: [BookClubsController],
  providers: [BookClubsService, CaslAbilityFactory],
  imports: [
    MongooseModule.forFeature([
      { name: BookClub.name, schema: BookClubSchema },
      { name: BookClubBook.name, schema: BookClubBookSchema },
      { name: Membership.name, schema: MembershipSchema },
    ]),
  ],
})
export class BookClubsModule {}
