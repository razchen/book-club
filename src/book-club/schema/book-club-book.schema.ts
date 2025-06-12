import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BookClub } from './book-club.schema';
import { Book } from 'src/book/schema/book.schema';

@Schema({ timestamps: true })
export class BookClubBook {
  @Prop({ required: true, type: Types.ObjectId, ref: BookClub.name })
  bookClub: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: Book.name })
  book: Types.ObjectId;
}

export type BookClubBookDocument = BookClubBook & Document;
export const BookClubBookSchema = SchemaFactory.createForClass(BookClubBook);
