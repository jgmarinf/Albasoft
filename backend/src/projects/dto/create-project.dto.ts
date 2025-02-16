import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsArray()
  @IsUUID(4, { each: true })
  @IsOptional()
  usersIds?: string[];
}
