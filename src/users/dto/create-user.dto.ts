import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;
}
