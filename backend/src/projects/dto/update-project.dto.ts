import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsArray()
  @IsUUID(4, { each: true })
  @IsOptional()
  usersIds?: string[];
}
