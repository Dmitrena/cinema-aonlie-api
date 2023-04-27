import { path } from 'app-root-path';
import { Movie, MovieDocument } from './../movie/schemas/movie.schema';
import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(searchTerm?: string): Promise<UserDocument[]> {
    let options = {};
    if (searchTerm) {
      options = {
        $or: [
          {
            email: RegExp(searchTerm, 'i'),
          },
        ],
      };
    }
    return this.userModel
      .find(options)
      .select('-password -updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .exec();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  async updateProfile(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);
    if (updateUserDto.password) {
      const hash2 = await this.hashData(updateUserDto.password);
      user.password = hash2;
    }
    if (updateUserDto.email) user.email = updateUserDto.email;

    if (updateUserDto.isAdmin || updateUserDto.isAdmin !== false) {
      user.isAdmin = updateUserDto.isAdmin;
    }

    await user.save();
  }

  async getCount() {
    return this.userModel.find().count().exec();
  }

  async delete(id: string) {
    this.userModel.findByIdAndDelete(id).exec();
    return;
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async getFavoriteMovies(userId: string) {
    return this.userModel
      .findById(userId, 'favorites')
      .populate({ path: 'favorites', populate: { path: 'genres' } })
      .exec()
      .then((data) => data.favorites);
  }
}
