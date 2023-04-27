import { RatingDto } from './dto/rating.dto';
import { MovieService } from './../movie/movie.service';
import { Rating, RatingDocument } from './schemas/rating.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<RatingDocument>,
    private movieService: MovieService,
  ) {}

  async getMovieValueByUser(movieId: Types.ObjectId, userId: Types.ObjectId) {
    return this.ratingModel
      .findOne({ movieId, userId })
      .select('value')
      .exec()
      .then((data) => (data ? data.value : 0));
  }

  async avarageRaingByMovie(movieId: Types.ObjectId | string) {
    const ratingsMovie: Rating[] = await this.ratingModel
      .aggregate()
      .match({ movieId: new Types.ObjectId(movieId) })
      .exec();

    return (
      ratingsMovie.reduce((acc, item) => acc + item.value, 0) /
      ratingsMovie.length
    );
  }

  async setRating(userId: Types.ObjectId, ratingDto: RatingDto) {
    const { movieId, value } = ratingDto;

    const newRating = await this.ratingModel
      .findOneAndUpdate(
        {
          movieId,
          userId,
        },
        { movieId, userId, value },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      )
      .exec();

    const avarageRating = await this.avarageRaingByMovie(movieId);

    await this.movieService.updateRating(movieId, avarageRating);

    return newRating;
  }
}
