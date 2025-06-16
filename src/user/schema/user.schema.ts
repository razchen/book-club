import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from 'src/types/Auth';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: Role.User })
  role: Role;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;
}

export type UserDocument = User &
  Document & {
    _id: Types.ObjectId;
  };

export const UserSchema = SchemaFactory.createForClass(User);
