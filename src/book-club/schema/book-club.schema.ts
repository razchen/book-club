import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class BookClub {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  owner: Types.ObjectId;
}

export type BookClubDocument = BookClub & Document;
export const BookClubSchema = SchemaFactory.createForClass(BookClub);

BookClubSchema.virtual('books', {
  ref: 'BookClubBook',
  localField: '_id',
  foreignField: 'bookClub',
});

BookClubSchema.set('toObject', { virtuals: true });
BookClubSchema.set('toJSON', { virtuals: true });
