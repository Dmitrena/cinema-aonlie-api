import { IdValidationPipe } from './../pipes/id.validation.pipe';
import { Public } from './../common/decorators/public.decorator';
import { AdminDecorator } from './../common/decorators/admin.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
  HttpCode,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Types } from 'mongoose';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('by-slug/:slug')
  @Public()
  async findBySlug(@Param('slug') slug: string) {
    return this.movieService.findBySlug(slug);
  }

  @Get('by-actor/:actorId')
  @Public()
  async findByActor(
    @Param('actorId', IdValidationPipe) actorId: Types.ObjectId,
  ) {
    return this.movieService.findByActor(actorId);
  }

  @Post('by-genres')
  @HttpCode(200)
  @Public()
  async findByGenres(@Body('genreIds') genreIds: string[]) {
    return this.movieService.findByGenres(genreIds);
  }

  @Get()
  @Public()
  async findAll(@Query('searchTerm') searchTerm?: string) {
    return this.movieService.findAll(searchTerm);
  }

  @Get('most-popular')
  @Public()
  async findMostPopular() {
    return this.movieService.findMostPopular();
  }

  @Patch('update-count-opened')
  @Public()
  async updateCountOpened(@Body('slug') slug: string) {
    return this.movieService.updateCountOpened(slug);
  }

  @Get(':id')
  @AdminDecorator('admin')
  async findById(@Param('id', IdValidationPipe) id: string) {
    return this.movieService.findById(id);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @AdminDecorator('admin')
  async create() {
    return this.movieService.create();
  }

  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() movieDto: MovieDto,
  ) {
    return this.movieService.update(id, movieDto);
  }

  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    this.movieService.delete(id);
    return;
  }
}
