import { MOVIE_NOT_FOUND } from './../constants/movie.constants';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie, MovieDocument } from './schemas/movie.schema';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
  ) {}
  async findBySlug(slug: string) {
    const movie = await this.movieModel
      .findOne({ slug })
      .populate('actors genres');
    if (!movie) throw new NotFoundException(MOVIE_NOT_FOUND);
    return movie;
  }

  async findByActor(actorId: Types.ObjectId) {
    const movie = await this.movieModel.find({ actors: actorId });
    if (!movie) throw new NotFoundException(MOVIE_NOT_FOUND);
    return movie;
  }

  async findByGenres(genreIds: string[]) {
    return this.movieModel.find({ genres: { $in: genreIds } });
  }

  async findAll(searchTerm?: string): Promise<MovieDocument[]> {
    let options = {};
    if (searchTerm) {
      options = {
        $or: [
          {
            title: RegExp(searchTerm, 'i'),
          },
        ],
      };
    }
    return this.movieModel
      .find(options)
      .select('-updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .populate('actors genres')
      .exec();
  }

  async findById(id: string) {
    const movie = await this.movieModel.findById(id);
    if (!movie) throw new NotFoundException(MOVIE_NOT_FOUND);

    return movie;
  }

  async findMostPopular() {
    return this.movieModel
      .find({ countOpened: { $gt: 0 } })
      .sort({ countOpened: -1 })
      .populate('genres');
  }

  async updateRating(id: Types.ObjectId, newRating: number) {
    return this.movieModel
      .findByIdAndUpdate(id, { rating: newRating }, { new: true })
      .exec();
  }

  async updateCountOpened(slug: string) {
    const updateDoc = await this.movieModel
      .findOneAndUpdate({ slug }, { $inc: { countOpened: 1 } }, { new: true })
      .exec();
    if (!updateDoc) throw new NotFoundException(MOVIE_NOT_FOUND);

    return updateDoc;
  }

  async create() {
    const defaultValue: MovieDto = {
      bigPoster: '',
      actors: [],
      genres: [],
      poster: '',
      title: '',
      videoUrl: '',
      slug: '',
    };

    const movie = await this.movieModel.create(defaultValue);
    return movie._id;
  }

  async update(id: string, movieDto: MovieDto) {
    return this.movieModel
      .findByIdAndUpdate(id, movieDto, {
        new: true,
      })
      .exec();
  }

  async delete(id: string) {
    const deletedDoc = await this.movieModel.findByIdAndDelete(id);
    if (!deletedDoc) throw new NotFoundException(MOVIE_NOT_FOUND);

    return deletedDoc;
  }
}
