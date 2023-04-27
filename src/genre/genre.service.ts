import { MovieService } from './../movie/movie.service';
import { GENER_NOT_FOUND } from './../constants/gener.constants';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GenreDto } from './dto/create-genre.dto';
import { Genre, GenreDocument } from './schemas/gener.schema';
import { ICollection } from './genre.interface';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(Genre.name) private genreModel: Model<GenreDocument>,
    private readonly movieService: MovieService,
  ) {}

  async findBySlug(slug: string) {
    const genre = await this.genreModel.findOne({ slug });
    if (!genre) throw new NotFoundException(GENER_NOT_FOUND);
    return genre;
  }

  async findAll(searchTerm?: string): Promise<GenreDocument[]> {
    let options = {};

    if (searchTerm) {
      options = {
        $or: [
          {
            name: new RegExp(searchTerm, 'i'),
          },
          {
            slug: new RegExp(searchTerm, 'i'),
          },
          {
            description: new RegExp(searchTerm, 'i'),
          },
        ],
      };
    }

    return this.genreModel
      .find(options)
      .select('-updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .exec();
  }

  async getCollections(): Promise<ICollection[]> {
    const genres = await this.findAll();

    const collections = Promise.all(
      genres.map((genre) => {
        const moviesByGenre = this.movieService.findByGenres([genre._id]);

        const result: ICollection = {
          _id: String(genre._id),
          title: genre.name,
          slug: genre.slug,
          image: '',
        };

        return result;
      }),
    );

    return collections;
  }

  // For admin

  async create() {
    const defaultValue: GenreDto = {
      name: '',
      slug: '',
      description: '',
      icon: '',
    };

    const gener = await this.genreModel.create(defaultValue);
    return gener._id;
  }

  async findById(id: string) {
    const gener = await this.genreModel.findById(id);
    if (!gener) throw new NotFoundException(GENER_NOT_FOUND);

    return gener;
  }

  async update(id: string, generDto: GenreDto) {
    return this.genreModel
      .findByIdAndUpdate(id, generDto, {
        new: true,
      })
      .exec();
  }

  async delete(id: string) {
    return this.genreModel.findByIdAndDelete(id);
  }
}
