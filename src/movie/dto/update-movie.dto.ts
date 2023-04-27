import { PartialType } from '@nestjs/mapped-types';
import { MovieDto } from './create-movie.dto';

export class UpdateMovieDto extends PartialType(MovieDto) {}
