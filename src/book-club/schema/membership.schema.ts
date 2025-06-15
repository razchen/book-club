import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BookClub } from './book-club.schema';
import { User } from 'src/user/schema/user.schema';

@Schema({ timestamps: true })
export class Membership {
  @Prop({ required: true, ref: BookClub.name, type: Types.ObjectId })
  bookClub: Types.ObjectId;

  @Prop({ required: true, ref: User.name, type: Types.ObjectId })
  user: Types.ObjectId;
}

export type MembershipDocument = Membership & Document;
export const MembershipSchema = SchemaFactory.createForClass(Membership);
