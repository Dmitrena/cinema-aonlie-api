import { Movie } from './../../movie/schemas/movie.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }] })
  favorites?: Movie[];
}

export const UserSchema = SchemaFactory.createForClass(User);
