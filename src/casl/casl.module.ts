import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BookClub,
  BookClubSchema,
} from 'src/book-club/schema/book-club.schema';
import { CaslGuard } from './casl.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BookClub.name, schema: BookClubSchema },
    ]),
  ],
  providers: [CaslAbilityFactory, CaslGuard],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
