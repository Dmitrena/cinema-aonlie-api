import { MovieModule } from './../movie/movie.module';
import { Rating, RatingSchema } from './schemas/rating.schema';
import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rating.name, schema: RatingSchema }]),
    MovieModule,
  ],
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule {}
