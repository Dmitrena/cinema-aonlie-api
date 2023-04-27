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
} from '@nestjs/common';
import { ActorService } from './actor.service';
import { ActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';

@Controller('actors')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  @AdminDecorator('admin')
  async create() {
    return this.actorService.create();
  }

  @Get('by-slug/:slug')
  @Public()
  async findBySlug(@Param('slug') slug: string) {
    return this.actorService.findBySlug(slug);
  }

  @Get()
  @Public()
  async findAll(@Query('searchTerm') searchTerm?: string) {
    return this.actorService.findAll(searchTerm);
  }

  @Get(':id')
  @AdminDecorator('admin')
  async findById(@Param('id', IdValidationPipe) id: string) {
    return this.actorService.findById(id);
  }

  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() actorDto: ActorDto,
  ) {
    return this.actorService.update(id, actorDto);
  }

  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    this.actorService.delete(id);
    return;
  }
}
