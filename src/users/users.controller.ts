import { MovieDocument } from './../movie/schemas/movie.schema';
import { ValidationPipe } from '@nestjs/common/pipes';
import { IdValidationPipe } from './../pipes/id.validation.pipe';
import { ForbiddenException } from '@nestjs/common/exceptions/forbidden.exception';
import { CurrentUser } from './../common/decorators/current-user.decorator';
import {
  CaslAbilityFactory,
  Action,
} from './../casl/casl-ability.factory/casl-ability.factory';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { AdminDecorator } from 'src/common/decorators/admin.decorator';
import { User, UserDocument } from './schemas/user.schema';
import { CurrentUserId } from 'src/common/decorators';
import { UsePipes } from '@nestjs/common/decorators/core/use-pipes.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto, @CurrentUser() user: User) {
    const ability = this.caslAbilityFactory.defineAbility(user);
    const isAllowed = ability.can(Action.Create, User);
    if (!isAllowed) throw new ForbiddenException('only admin');
    return this.usersService.create(createUserDto);
  }
  @Get()
  @AdminDecorator('admin')
  async findAll(@Query('searchTerm') searchTerm?: string) {
    return this.usersService.findAll(searchTerm);
  }

  @Get('profile')
  async findProfile(@CurrentUserId() userId: string) {
    return this.usersService.findById(userId);
  }

  @UsePipes(new ValidationPipe())
  @Patch('profile')
  async updateProfile(
    @CurrentUserId() userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(userId, updateUserDto);
  }

  @Get('profile/favorites')
  async findFavorites(@CurrentUserId() userId: string) {
    return this.usersService.getFavoriteMovies(userId);
  }

  @UsePipes(new ValidationPipe())
  @Patch(':id')
  @AdminDecorator('admin')
  async updateUser(
    @Param('id', IdValidationPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(id, updateUserDto);
  }

  @Get('count')
  @AdminDecorator('admin')
  async getCount() {
    return this.usersService.getCount();
  }

  @AdminDecorator('admin')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
