import { Movie } from './../movie/schemas/movie.schema';
import { ACTOR_NOT_FOUND } from './../constants/actor.constants';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { Actor, ActorDocument } from './schemas/actor.schema';

@Injectable()
export class ActorService {
  constructor(
    @InjectModel(Actor.name) private actorModel: Model<ActorDocument>,
  ) {}

  async findBySlug(slug: string) {
    const actor = await this.actorModel.findOne({ slug });
    if (!actor) throw new NotFoundException(ACTOR_NOT_FOUND);
    return actor;
  }

  async findAll(searchTerm?: string): Promise<ActorDocument[]> {
    let options = {};
    if (searchTerm) {
      options = {
        $or: [
          {
            name: RegExp(searchTerm, 'i'),
          },
          {
            slug: RegExp(searchTerm, 'i'),
          },
        ],
      };
    }

    //Aggregation

    return this.actorModel
      .aggregate()
      .match(options)
      .lookup({
        from: 'movies',
        foreignField: 'actors',
        localField: '_id',
        as: 'movies',
      })
      .addFields({
        countMovies: {
          $size: '$movies',
        },
      })
      .project({ __v: 0, updatedAt: 0, movies: 0 })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string) {
    const actor = await this.actorModel.findById(id);
    if (!actor) throw new NotFoundException(ACTOR_NOT_FOUND);

    return actor;
  }

  async create() {
    const defaultValue: ActorDto = {
      name: '',
      slug: '',
      photo: '',
    };

    const actor = await this.actorModel.create(defaultValue);
    return actor._id;
  }

  async update(id: string, actorDto: ActorDto) {
    return this.actorModel
      .findByIdAndUpdate(id, actorDto, {
        new: true,
      })
      .exec();
  }

  async delete(id: string) {
    const deletedDoc = await this.actorModel.findByIdAndDelete(id);
    if (!deletedDoc) throw new NotFoundException(ACTOR_NOT_FOUND);

    return deletedDoc;
  }
}
