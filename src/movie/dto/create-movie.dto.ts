import {
  IsArray,
  IsNumber,
  IsString,
  IsBoolean,
  IsObject,
  IsOptional,
} from 'class-validator';

export class Parameters {
  @IsNumber()
  year: number;

  @IsNumber()
  duration: number;

  @IsString()
  country: string;
}

export class MovieDto {
  @IsString()
  poster: string;

  @IsString()
  bigPoster: string;

  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsObject()
  @IsOptional()
  parameters?: Parameters;

  @IsString()
  videoUrl: string;

  @IsArray()
  @IsString({ each: true })
  genres: string[];

  @IsArray()
  @IsString({ each: true })
  actors: string[];

  @IsBoolean()
  @IsOptional()
  isSendTelegram?: boolean;
}
