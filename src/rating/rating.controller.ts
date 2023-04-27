import { RatingDto } from './dto/rating.dto';
import { IdValidationPipe } from './../pipes/id.validation.pipe';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { Types } from 'mongoose';
import { CurrentUserId } from 'src/common/decorators';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get(':movieId')
  getMovieValueByUser(
    @Param('movieId', IdValidationPipe) movieId: Types.ObjectId,
    @CurrentUserId() userId: Types.ObjectId,
  ) {
    return this.ratingService.getMovieValueByUser(movieId, userId);
  }

  @UsePipes(new ValidationPipe())
  @Post('set-rating')
  @HttpCode(200)
  async setRating(
    @CurrentUserId() userId: Types.ObjectId,
    @Body() ratingDto: RatingDto,
  ) {
    return this.ratingService.setRating(userId, ratingDto);
  }
}
