import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsNotEmpty({ message: 'El email no puede estar vacío' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;
}
