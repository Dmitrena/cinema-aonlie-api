import { ValidationPipe } from '@nestjs/common/pipes';
import { Public } from '../common/decorators';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreDto } from './dto/create-genre.dto';
import { AdminDecorator } from 'src/common/decorators/admin.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  @AdminDecorator('admin')
  async create() {
    return this.genreService.create();
  }

  @Get('by-slug/:slug')
  @Public()
  async findBySlug(@Param('slug') slug: string) {
    return this.genreService.findBySlug(slug);
  }

  @Get('collection')
  @Public()
  async getCollection() {
    return this.genreService.getCollections();
  }

  @Get()
  @Public()
  async findAll(@Query('searchTerm') searchTerm?: string) {
    return this.genreService.findAll(searchTerm);
  }

  @Get(':id')
  @AdminDecorator('admin')
  async findById(@Param('id', IdValidationPipe) id: string) {
    return this.genreService.findById(id);
  }

  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() generDto: GenreDto,
  ) {
    return this.genreService.update(id, generDto);
  }

  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    this.genreService.delete(id);
    return;
  }
}
