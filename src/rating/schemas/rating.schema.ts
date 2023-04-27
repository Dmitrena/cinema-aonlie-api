import { User } from 'src/users/schemas/user.schema';
import { Movie } from './../../movie/schemas/movie.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type RatingDocument = Rating & Document;

@Schema({ timestamps: true })
export class Rating {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  userId: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }] })
  movieId: Movie;

  @Prop()
  value: number;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
